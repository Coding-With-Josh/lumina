"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Mic,
  Square,
  Image as ImageIcon,
  FileText,
  MoreHorizontal,
  Pin,
  Search as SearchIcon,
  Bell,
  PanelRightClose,
  PanelRightOpen,
  Link2,
  Trash,
  AudioLines,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

import { User, messages, conversations } from "@/lib/db/schema";

// --- Types derived from Schema ---

type UIMessage = Omit<typeof messages.$inferSelect, "createdAt" | "readAt"> & {
  createdAt: string; // ISO string
  readAt?: string | null;
  type: "text" | "image" | "file" | "voice" | "offer"; // Extended property not in DB yet
  status?: "sending" | "sent" | "error";
};

type UIConversation = Omit<
  typeof conversations.$inferSelect,
  "createdAt" | "updatedAt"
> & {
  participants: User[];
  lastMessage: UIMessage | null;
  unreadCount: number;
  isPinned: boolean;
  isTyping?: boolean;
};

const currentUser: User = {
  id: 1,
  name: "Joshua",
  email: "joshua@example.com",
  profilePicture: "/avatars/me.jpg",
  status: "online",
  role: "brand",
  accountType: "brand",
  uuid: "user-1",
  username: "joshua",
  passwordHash: null,
  emailVerified: true,
  phoneNumber: null,
  phoneVerified: false,
  kycStatus: "none",
  bio: null,
  country: null,
  timezone: null,
  twoFactorEnabled: false,
  twoFactorSecret: null,
  twoFactorBackupCodes: null,
  suspended: false,
  suspensionReason: null,
  onboardingCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

import useSWR from "swr";
import { CreateOfferDialog } from "@/components/messages/create-offer-dialog";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

import {
  getConversations,
  getMessages,
  sendRichMessage,
  startConversation,
  startConversationByUsername,
  deleteConversation,
} from "@/app/actions/messages";
import { acceptContract } from "@/app/actions/contracts";
import { toast } from "sonner";

// ... (keep imports)

export default function MessagesPage() {
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const searchParams = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isBootstrappingConversation, setIsBootstrappingConversation] =
    useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [acceptingOfferId, setAcceptingOfferId] = useState<number | null>(null);
  const hasInitializedFromQuery = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<UIMessage[]>([]);

  // Fetch conversations
  const { data: conversationsData, mutate: mutateConversations } = useSWR<
    UIConversation[]
  >(
    user ? "/api/conversations" : null,
    () => getConversations() as Promise<UIConversation[]>
  );
  const conversations = useMemo(
    () => conversationsData ?? [],
    [conversationsData]
  );

  // Fetch messages for active conversation
  const { data: activeMessagesData, mutate: mutateMessages } = useSWR(
    activeConversationId ? `/api/messages/${activeConversationId}` : null,
    () => (activeConversationId ? getMessages(activeConversationId) : [])
  );
  const activeMessages = useMemo(
    () => activeMessagesData ?? [],
    [activeMessagesData]
  );

  // Set initial active conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Hydrate from ?username= (preferred) or ?userId= param (e.g., deep link from Discover)
  useEffect(() => {
    if (hasInitializedFromQuery.current) return;
    const usernameParam =
      searchParams?.get("username") || searchParams?.get("user");
    const userIdParam = searchParams?.get("userId");

    const normalize = (val?: string | null) => (val || "").trim().toLowerCase();

    const targetUsername = normalize(usernameParam);
    const targetId = userIdParam ? Number(userIdParam) : null;

    if (!targetUsername && (!targetId || Number.isNaN(targetId))) return;

    const existing = conversations.find((c) =>
      c.participants.some((p) => {
        if (targetUsername) return normalize(p.username) === targetUsername;
        if (targetId) return p.id === targetId;
        return false;
      })
    );

    if (existing) {
      setActiveConversationId(existing.id);
      hasInitializedFromQuery.current = true;
      return;
    }

    const createByUsername = async () => {
      setIsBootstrappingConversation(true);
      const res = await startConversationByUsername(targetUsername);
      hasInitializedFromQuery.current = true;
      setIsBootstrappingConversation(false);
      if (res?.success && res.conversationId) {
        mutateConversations();
        setActiveConversationId(res.conversationId);
      } else {
        toast.error(res?.error || "Couldn't start conversation");
      }
    };

    const createById = async () => {
      setIsBootstrappingConversation(true);
      const res = await startConversation(targetId!);
      hasInitializedFromQuery.current = true;
      setIsBootstrappingConversation(false);
      if (res?.success && res.conversationId) {
        mutateConversations();
        setActiveConversationId(res.conversationId);
      } else {
        toast.error(res?.error || "Couldn't start conversation");
      }
    };

    if (targetUsername) {
      createByUsername();
    } else if (targetId && !Number.isNaN(targetId)) {
      createById();
    }
  }, [conversations, searchParams, mutateConversations]);

  const parseMessageContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.type) {
        return parsed as {
          type: "text" | "image" | "link" | "voice" | "offer";
          text?: string;
          url?: string;
          durationMs?: number;
          fileName?: string;
          contractId?: number;
          campaignId?: number;
          campaignTitle?: string;
          amount?: number;
          currency?: string;
          description?: string;
          deliverables?: string[];
          dueDate?: string;
          status?: "pending" | "accepted";
        };
      }
    } catch (err) {
      // fallback to plain text
    }
    return { type: "text" as const, text: content };
  };

  const [inputValue, setInputValue] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync fetched messages into local state for optimistic updates
  useEffect(() => {
    if (!activeMessagesData) return;
    setLocalMessages(
      [...(activeMessages as UIMessage[])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
    // Scroll to bottom on new data
    if (scrollRef.current) {
      const id = requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [activeMessagesData, activeConversationId, activeMessages]);

  useEffect(() => {
    if (!activeConversationId) {
      setLocalMessages([]);
    }
  }, [activeConversationId]);

  // Cleanup recording timer/stream on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const diff = d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    if (diff === 0) return "Today";
    if (diff === -86400000) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: today.getFullYear() === d.getFullYear() ? undefined : "numeric",
    });
  };

  const groupedMessages = useMemo(() => {
    const groups: { date: string; items: UIMessage[] }[] = [];
    const sorted = [...localMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    sorted.forEach((m) => {
      const dateKey = new Date(m.createdAt).toDateString();
      let group = groups.find((g) => g.date === dateKey);
      if (!group) {
        group = { date: dateKey, items: [] };
        groups.push(group);
      }
      group.items.push(m);
    });
    return groups;
  }, [localMessages]);

  const sharedMedia = useMemo(() => {
    return localMessages
      .map((m) => ({ msg: m, parsed: parseMessageContent(m.content) }))
      .filter((entry) => entry.parsed.type === "image" && entry.parsed.url)
      .map((entry) => ({
        id: entry.msg.id,
        url: entry.parsed.url as string,
        fileName: entry.parsed.fileName || "Image",
      }));
  }, [localMessages]);

  const sharedVoiceNotes = useMemo(() => {
    return localMessages
      .map((m) => ({ msg: m, parsed: parseMessageContent(m.content) }))
      .filter((entry) => entry.parsed.type === "voice" && entry.parsed.url)
      .map((entry) => ({
        id: entry.msg.id,
        url: entry.parsed.url as string,
        fileName: entry.parsed.fileName || "Voice note",
        createdAt: entry.msg.createdAt,
      }));
  }, [localMessages]);

  // Always keep scroll at bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const id = requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [groupedMessages, activeConversationId]);

  // Update currentUser mock to reflect real user role if available
  const effectiveUser: User = user
    ? {
        ...currentUser, // Fallback for missing fields
        ...user,
        profilePicture: user.profilePicture || currentUser.profilePicture,
        status: user.status || "online",
      }
    : currentUser;

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const otherParticipant = activeConversation?.participants[0] || null;
  const hasConversation = !!activeConversation;
  const displayName = hasConversation
    ? otherParticipant?.name || "User"
    : isBootstrappingConversation
    ? "Setting up..."
    : "No conversation selected";
  const displayRole = hasConversation
    ? otherParticipant?.accountType === "brand"
      ? "Brand"
      : "Creator"
    : "";
  const formatMoney = (val?: number, currency = "USD") =>
    typeof val === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(val)
      : "—";
  const formatDueDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "Flexible";

  // (The scroll-to-bottom is handled by the effects above)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeConversationId) return;

    const content = inputValue;
    setInputValue(""); // Optimistic clear
    setIsSending(true);

    const optimistic: UIMessage = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: effectiveUser.id,
      content,
      type: "text",
      createdAt: new Date().toISOString(),
      status: "sending",
    };
    setLocalMessages((prev) => [...prev, optimistic]);

    const result = await sendRichMessage(activeConversationId, {
      type: "text",
      text: content,
    });

    if (result.success) {
      mutateMessages();
      mutateConversations();
    } else {
      toast.error("Failed to send message");
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id ? { ...m, status: "error" } : m
        )
      );
    }
    setIsSending(false);
  };

  const handleSendLink = async () => {
    const url = prompt("Paste the link to send");
    if (!url || !activeConversationId) return;
    const result = await sendRichMessage(activeConversationId, {
      type: "link",
      url,
      text: url,
    });
    if (result.success) {
      mutateMessages();
      mutateConversations();
    } else {
      toast.error("Failed to send link");
    }
  };

  const handleImageFile = async (file?: File | null) => {
    if (!file || !activeConversationId) return;
    setIsSending(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      const optimistic: UIMessage = {
        id: Date.now(),
        conversationId: activeConversationId,
        senderId: effectiveUser.id,
        content: JSON.stringify({
          type: "image",
          url,
          fileName: file.name,
        }),
        type: "image",
        createdAt: new Date().toISOString(),
        status: "sending",
      };
      setLocalMessages((prev) => [...prev, optimistic]);

      const result = await sendRichMessage(activeConversationId, {
        type: "image",
        url,
        fileName: file.name,
      });
      if (result.success) {
        mutateMessages();
        mutateConversations();
      } else {
        toast.error("Failed to send image");
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.id === optimistic.id ? { ...m, status: "error" } : m
          )
        );
      }
      setIsSending(false);
    };
    reader.readAsDataURL(file);
  };

  const sendVoiceDataUrl = async (dataUrl: string, fileName: string) => {
    if (!activeConversationId) return;
    setIsSending(true);
    const optimistic: UIMessage = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: effectiveUser.id,
      content: JSON.stringify({
        type: "voice",
        url: dataUrl,
        fileName,
      }),
      type: "voice",
      createdAt: new Date().toISOString(),
      status: "sending",
    };
    setLocalMessages((prev) => [...prev, optimistic]);

    const result = await sendRichMessage(activeConversationId, {
      type: "voice",
      url: dataUrl,
      fileName,
    });
    if (result.success) {
      mutateMessages();
      mutateConversations();
    } else {
      toast.error("Failed to send voice note");
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id ? { ...m, status: "error" } : m
        )
      );
    }
    setIsSending(false);
  };

  const handleVoiceFile = async (file?: File | null) => {
    if (!file || !activeConversationId) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      await sendVoiceDataUrl(url, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAcceptOffer = async (contractId?: number) => {
    if (!contractId) return;
    setAcceptingOfferId(contractId);
    const res = await acceptContract(contractId);
    if (res?.success) {
      toast.success("Offer accepted and campaign joined");
      await Promise.all([mutateMessages(), mutateConversations()]);
      setLocalMessages((prev) =>
        prev.map((m) => {
          const parsed = parseMessageContent(m.content);
          if (parsed.type === "offer" && parsed.contractId === contractId) {
            return {
              ...m,
              content: JSON.stringify({ ...parsed, status: "accepted" }),
            };
          }
          return m;
        })
      );
    } else {
      toast.error(res?.error || "Failed to accept offer");
    }
    setAcceptingOfferId(null);
  };

  const startRecording = async () => {
    if (!hasConversation || isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingChunksRef.current = [];
      setRecordingSeconds(0);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        const blob = new Blob(recordingChunksRef.current, {
          type: "audio/webm",
        });
        recordingChunksRef.current = [];
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          await sendVoiceDataUrl(base64, `voice-${Date.now()}.webm`);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } catch (err) {
      console.error(err);
      toast.error("Microphone permission needed to record");
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversationId) return;
    const confirmed = confirm(
      "Delete this conversation? This cannot be undone."
    );
    if (!confirmed) return;
    setIsDeletingConversation(true);
    const toastId = toast.loading("Deleting conversation…");
    const res = await deleteConversation(activeConversationId);
    if (res?.success) {
      await mutateConversations();
      const remaining = conversations.filter(
        (c) => c.id !== activeConversationId
      );
      setActiveConversationId(remaining[0]?.id ?? null);
      toast.success("Conversation deleted");
    } else {
      toast.error(res?.error || "Failed to delete conversation");
    }
    toast.dismiss(toastId);
    setIsDeletingConversation(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] mx-auto pb-4 relative flex gap-6">
      {/* LEFT SIDEBAR: Conversations */}
      <Card className="w-full md:w-[380px] pt-0 flex flex-col h-full border-muted/60 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="p-5 border-b border-muted/50 bg-background/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Messages
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-background/50 border-muted/60 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl transition-all h-11"
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-6">
            {/* Pinned Section */}
            {conversations.some((c) => c.isPinned) && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground px-3 flex items-center gap-2">
                  <Pin className="h-3 w-3" /> PINNED
                </h3>
                {conversations
                  .filter((c) => c.isPinned)
                  .map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={activeConversationId === conversation.id}
                      onClick={() => setActiveConversationId(conversation.id)}
                    />
                  ))}
              </div>
            )}

            {/* All Messages Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground px-3">
                ALL MESSAGES
              </h3>
              {conversations
                .filter((c) => !c.isPinned)
                .map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeConversationId === conversation.id}
                    onClick={() => setActiveConversationId(conversation.id)}
                  />
                ))}
            </div>

            {/* Role-Based Quick Actions (Bottom of Sidebar) */}
            <div className="mt-4 pt-4 border-t border-muted/50 px-2">
              {effectiveUser.accountType === "brand" ? (
                <Link href="/dashboard/creators">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50"
                  >
                    <Search className="h-4 w-4" />
                    Find Creators to Message
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/campaigns">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50"
                  >
                    <Search className="h-4 w-4" />
                    Find Campaigns to Join
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* MAIN CHAT AREA */}
      <Card className="flex-1 flex flex-col pt-0 h-full border-muted/60 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl relative">
        {/* Decorative Internal Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-xl pointer-events-none" />
        {!hasConversation && !isBootstrappingConversation && (
          <div className="absolute inset-0 pointer-events-none bg-background/60 backdrop-blur-sm z-0" />
        )}

        {/* Chat Header */}
        <div
          className={cn(
            "h-20 px-6 border-b border-muted/50 bg-background/40 backdrop-blur-md flex items-center justify-between z-10 shrink-0 transition-all",
            !hasConversation && !isBootstrappingConversation
              ? "opacity-60 blur-[1px]"
              : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-11 w-11 border-2 border-background shadow-md">
                <AvatarImage
                  src={otherParticipant?.profilePicture || undefined}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
                  {(otherParticipant?.name || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              {otherParticipant?.status === "online" && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-xl bg-emerald-500 border-2 border-background shadow-sm animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                {displayName}
                {displayRole && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 font-normal bg-emerald-500/5 text-emerald-700 border-emerald-500/20"
                  >
                    {displayRole}
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {hasConversation ? (
                  otherParticipant?.status === "online" ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-xl bg-emerald-500" />
                      Online now
                    </>
                  ) : (
                    `Last seen 2h ago`
                  )
                ) : isBootstrappingConversation ? (
                  "Linking thread…"
                ) : (
                  "No active chat"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {effectiveUser.accountType === "brand" && (
              <Button
                size="sm"
                onClick={() => setIsOfferDialogOpen(true)}
                className="hidden sm:flex bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl mr-2"
              >
                Create Offer
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500"
                    onClick={handleDeleteConversation}
                    disabled={!activeConversationId || isDeletingConversation}
                  >
                    {isDeletingConversation ? (
                      <span className="h-5 w-5 animate-spin border-2 border-red-500/60 border-t-transparent rounded-full" />
                    ) : (
                      <Trash className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete conversation</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice Call</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Video Call</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                    onClick={() => setShowRightPanel(!showRightPanel)}
                  >
                    {showRightPanel ? (
                      <PanelRightClose className="h-5 w-5" />
                    ) : (
                      <PanelRightOpen className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages List */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          ref={scrollRef}
        >
          {!hasConversation ? (
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div className="space-y-3">
                {isBootstrappingConversation ? (
                  <>
                    <p className="text-lg font-semibold">
                      Setting up your conversation…
                    </p>
                    <p className="text-sm">
                      Linking you with this user and loading the thread.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping delay-150" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping delay-300" />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold">
                      No conversation selected
                    </p>
                    <p className="text-sm">
                      Pick a chat on the left or start one from Discover.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : localMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div className="space-y-3">
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">Say hello to start the conversation.</p>
              </div>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date} className="space-y-4">
                <div className="flex justify-center">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-xl border border-muted/50 backdrop-blur-sm">
                    {formatDateLabel(group.items[0].createdAt)}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {group.items.map((msg) => {
                    const parsed = parseMessageContent(msg.content);
                    const isMe = msg.senderId === effectiveUser.id;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          "flex gap-4 max-w-[75%]",
                          isMe ? "ml-auto flex-row-reverse" : ""
                        )}
                      >
                        {!isMe && (
                          <Avatar className="h-8 w-8 mt-auto border border-muted shadow-sm">
                            <AvatarImage
                              src={
                                otherParticipant?.profilePicture || undefined
                              }
                            />
                            <AvatarFallback>
                              {(otherParticipant?.name || "U").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "flex flex-col gap-1",
                            isMe ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm relative transition-all duration-200",
                              isMe
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-none shadow-emerald-500/20"
                                : "bg-white dark:bg-muted/30 backdrop-blur-md border border-muted/50 rounded-bl-none shadow-black/5"
                            )}
                          >
                            {parsed.type === "image" && parsed.url ? (
                              <img
                                src={parsed.url}
                                alt={parsed.fileName || "Image"}
                                className="max-w-[320px] rounded-2xl border border-white/20 shadow-md"
                              />
                            ) : parsed.type === "link" && parsed.url ? (
                              <a
                                href={parsed.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 dark:text-emerald-300 underline break-all"
                              >
                                {parsed.text || parsed.url}
                              </a>
                            ) : parsed.type === "voice" && parsed.url ? (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-emerald-500/15 text-emerald-700">
                                  <AudioLines className="h-5 w-5" />
                                </div>
                                <audio controls className="w-48">
                                  <source src={parsed.url} />
                                </audio>
                              </div>
                            ) : parsed.type === "offer" ? (
                              <div
                                className={cn(
                                  "space-y-3",
                                  isMe ? "text-white" : "text-foreground"
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p
                                      className={cn(
                                        "text-xs uppercase tracking-wide",
                                        isMe
                                          ? "text-white/80"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      Offer
                                    </p>
                                    <p className="font-semibold">
                                      {parsed.campaignTitle || "Campaign"}
                                    </p>
                                  </div>
                                  <Badge
                                    className={cn(
                                      isMe
                                        ? "bg-white/20 border-white/30 text-white"
                                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                                    )}
                                  >
                                    {parsed.status === "accepted"
                                      ? "Accepted"
                                      : "Pending"}
                                  </Badge>
                                </div>
                                <div
                                  className={cn(
                                    "flex items-center gap-2 text-sm",
                                    isMe ? "text-white/90" : "text-foreground"
                                  )}
                                >
                                  <span>{formatMoney(parsed.amount)}</span>
                                  <span>•</span>
                                  <span>
                                    Due {formatDueDate(parsed.dueDate)}
                                  </span>
                                </div>
                                {parsed.description && (
                                  <p
                                    className={cn(
                                      "text-sm leading-relaxed",
                                      isMe
                                        ? "text-white/80"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {parsed.description}
                                  </p>
                                )}
                                {parsed.deliverables &&
                                  parsed.deliverables.length > 0 && (
                                    <div className="space-y-1">
                                      <p
                                        className={cn(
                                          "text-xs",
                                          isMe
                                            ? "text-white/80"
                                            : "text-muted-foreground"
                                        )}
                                      >
                                        Deliverables
                                      </p>
                                      <ul
                                        className={cn(
                                          "space-y-1 text-sm",
                                          isMe
                                            ? "text-white/90"
                                            : "text-foreground"
                                        )}
                                      >
                                        {parsed.deliverables.map((d, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-center gap-2"
                                          >
                                            <span
                                              className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                isMe
                                                  ? "bg-white/70"
                                                  : "bg-emerald-500"
                                              )}
                                            />
                                            <span>{d}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                {!isMe && parsed.status !== "accepted" && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                    disabled={
                                      acceptingOfferId === parsed.contractId
                                    }
                                    onClick={() =>
                                      handleAcceptOffer(parsed.contractId)
                                    }
                                  >
                                    {acceptingOfferId === parsed.contractId
                                      ? "Accepting..."
                                      : "Accept & join campaign"}
                                  </Button>
                                )}
                                {isMe && parsed.status === "accepted" && (
                                  <p className="text-xs text-white/80">
                                    Creator accepted • campaign joined
                                  </p>
                                )}
                              </div>
                            ) : (
                              parsed.text || msg.content
                            )}
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium px-1",
                              isMe ? "justify-end" : "justify-start"
                            )}
                          >
                            <span>{formatTime(msg.createdAt)}</span>
                            {msg.status === "sending" && (
                              <span className="text-[10px] text-emerald-500">
                                sending…
                              </span>
                            )}
                            {msg.status === "error" && (
                              <span className="text-[10px] text-red-500">
                                failed
                              </span>
                            )}
                            {isMe &&
                              msg.status !== "sending" &&
                              (msg.readAt ? (
                                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {activeConversation?.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[75%]"
            >
              <Avatar className="h-8 w-8 mt-auto border border-muted shadow-sm">
                <AvatarImage
                  src={otherParticipant?.profilePicture || undefined}
                />
                <AvatarFallback>
                  {(otherParticipant?.name || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-muted/30 backdrop-blur-md border border-muted/50 rounded-3xl rounded-bl-none p-4 shadow-sm flex gap-1.5 items-center h-[52px]">
                <span className="w-2 h-2 bg-emerald-500/50 rounded-xl animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-emerald-500/50 rounded-xl animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-emerald-500/50 rounded-xl animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-muted/50 bg-background/40 backdrop-blur-md z-10">
          <div className="flex items-end gap-3 bg-background/60 border border-muted/60 rounded-[24px] p-2 pr-3 shadow-lg focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all hover:border-emerald-500/30">
            <div className="flex gap-1 pb-1 pl-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                onClick={() => imageInputRef.current?.click()}
                disabled={!hasConversation}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                onClick={() => imageInputRef.current?.click()}
                disabled={!hasConversation}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                onClick={handleSendLink}
                disabled={!hasConversation}
              >
                <Link2 className="h-5 w-5" />
              </Button>
            </div>

            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-red-500/10 text-red-500 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Recording {recordingSeconds}s
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={stopRecording}
                >
                  Stop
                </Button>
              </div>
            )}

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={!hasConversation}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-4 h-auto max-h-32 min-h-[50px] text-base placeholder:text-muted-foreground/50 disabled:opacity-60"
            />

            <div className="flex gap-1 pb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                disabled={!hasConversation}
              >
                <Smile className="h-5 w-5" />
              </Button>
              {inputValue.trim() ? (
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 animate-in zoom-in-50 disabled:opacity-60"
                  disabled={!hasConversation || isSending}
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </Button>
              ) : (
                <Button
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-xl text-muted-foreground transition-colors",
                    isRecording
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : "hover:text-emerald-500 hover:bg-emerald-500/10"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!hasConversation}
                >
                  {isRecording ? (
                    <Square className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files?.[0])}
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleVoiceFile(e.target.files?.[0])}
            />
          </div>
        </div>
      </Card>

      {/* RIGHT SIDEBAR: Details (Collapsible) */}
      <AnimatePresence>
        {showRightPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden xl:flex flex-col w-[300px] h-full"
          >
            <Card className="h-full w-[320px] border-muted/60 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl flex flex-col">
              {!hasConversation ? (
                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground px-6">
                  <div className="space-y-3">
                    <p className="font-semibold">No conversation selected</p>
                    <p className="text-sm">
                      Pick a chat to view participant details and shared media.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-6 flex flex-col items-center border-b border-muted/50 bg-background/40 backdrop-blur-md">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl mb-4">
                      <AvatarImage
                        src={otherParticipant?.profilePicture || undefined}
                      />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
                        {(otherParticipant?.name || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{displayName}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {displayRole || "Participant"}
                    </p>

                    <div className="flex gap-3 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-muted hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-500/5"
                      >
                        Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-muted hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-500/5"
                      >
                        Mute
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                          Shared Media
                        </h3>
                        {sharedMedia.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Media you share here will appear in this panel.
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {sharedMedia.map((media) => (
                              <a
                                key={media.id}
                                href={media.url}
                                target="_blank"
                                rel="noreferrer"
                                className="aspect-square rounded-lg overflow-hidden border border-muted hover:border-emerald-500/50 transition-colors"
                              >
                                <img
                                  src={media.url}
                                  alt={media.fileName}
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                          Voice Notes
                        </h3>
                        {sharedVoiceNotes.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Record or send a voice note to see it here.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {sharedVoiceNotes.map((voice) => (
                              <div
                                key={voice.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-muted/50 hover:border-emerald-500/30 transition-colors"
                              >
                                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                  <AudioLines className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {voice.fileName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDateLabel(voice.createdAt)}
                                  </p>
                                </div>
                                <audio controls className="w-28">
                                  <source src={voice.url} />
                                </audio>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Dialog */}
      {effectiveUser.accountType === "brand" && otherParticipant && (
        <CreateOfferDialog
          open={isOfferDialogOpen}
          onOpenChange={setIsOfferDialogOpen}
          brandId={effectiveUser.id}
          creatorId={otherParticipant.id}
          creatorName={otherParticipant.name || "User"}
          conversationId={activeConversationId}
        />
      )}
    </div>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: UIConversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const participant = conversation.participants[0];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden",
        isActive
          ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]"
          : "hover:bg-muted/40 border border-transparent hover:border-muted/50"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
      )}

      <div className="relative shrink-0">
        <Avatar
          className={cn(
            "h-12 w-12 border-2 shadow-sm transition-transform duration-300",
            isActive
              ? "border-emerald-500/30 scale-105"
              : "border-background group-hover:scale-105"
          )}
        >
          <AvatarImage src={participant.profilePicture || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold">
            {(participant.name || "U").charAt(0)}
          </AvatarFallback>
        </Avatar>
        {/* Status indicator */}
        {participant.status === "online" && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-xl bg-emerald-500 border-2 border-background shadow-sm animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={cn(
              "font-bold text-sm truncate transition-colors",
              isActive
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-foreground"
            )}
          >
            {participant.name}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium",
              isActive ? "text-emerald-600/70" : "text-muted-foreground"
            )}
          >
            {conversation.lastMessage?.createdAt}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs truncate transition-colors",
              isActive
                ? "text-emerald-900/60 dark:text-emerald-100/60"
                : "text-muted-foreground group-hover:text-foreground/80"
            )}
          >
            {conversation.isTyping ? (
              <span className="text-emerald-500 font-medium animate-pulse">
                Typing...
              </span>
            ) : (
              conversation.lastMessage?.content || "No messages yet"
            )}
          </p>

          {conversation.unreadCount > 0 && (
            <Badge className="h-5 min-w-[20px] rounded-xl p-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 animate-in zoom-in">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
