"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { getBrandCampaigns } from "@/app/actions/campaigns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContract } from "@/app/actions/contracts";
import { sendRichMessage } from "@/app/actions/messages";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

// ... (keep other imports)

interface CreateOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: number;
  creatorId: number;
  creatorName: string;
  conversationId: number | null;
}

export function CreateOfferDialog({
  open,
  onOpenChange,
  brandId,
  creatorId,
  creatorName,
  conversationId,
}: CreateOfferDialogProps) {
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [campaignId, setCampaignId] = useState<string>("");
  const [campaigns, setCampaigns] = useState<{ id: number; title: string }[]>(
    []
  );

  // Fetch campaigns when dialog opens
  useEffect(() => {
    if (open) {
      setCampaignsLoading(true);
      setCampaignsError(null);
      getBrandCampaigns()
        .then((data) => {
          if (data) {
            setCampaigns(data);
            if (data.length === 0) {
              toast.info("No campaigns yet. Create one to send offers.");
            }
          }
        })
        .catch((err) => {
          console.error(err);
          setCampaignsError("Failed to load campaigns");
          toast.error("Couldn't load campaigns. Please retry.");
        })
        .finally(() => setCampaignsLoading(false));
    }
  }, [open]);

  const handleAddDeliverable = () => {
    setDeliverables([...deliverables, ""]);
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  const handleSubmit = async () => {
    if (!campaignId) {
      toast.error("Pick the campaign for this offer");
      return;
    }
    const selectedCampaign = campaigns.find(
      (c) => c.id.toString() === campaignId
    );
    if (!selectedCampaign) {
      toast.error("Campaign is required");
      return;
    }
    if (!amount || deliverables.some((d) => !d.trim())) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await createContract({
        brandId,
        creatorId,
        title: selectedCampaign.title,
        description,
        amount: parseInt(amount),
        currency: "USD",
        deliverables: deliverables.filter((d) => d.trim()),
        dueDate: dueDate?.toISOString(),
        campaignId: parseInt(campaignId),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Offer sent successfully!");
        if (conversationId) {
          await sendRichMessage(conversationId, {
            type: "offer",
            contractId: result.contractId,
            campaignId: parseInt(campaignId),
            campaignTitle: selectedCampaign.title,
            amount: parseInt(amount),
            currency: "USD",
            description,
            deliverables: deliverables.filter((d) => d.trim()),
            dueDate: dueDate?.toISOString(),
            status: "pending",
          });
        }
        onOpenChange(false);
        // Reset form
        setDescription("");
        setAmount("");
        setDeliverables([""]);
        setDueDate(undefined);
        setCampaignId("");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent">
            Create Offer
          </DialogTitle>
          <DialogDescription>
            Send a formal offer to{" "}
            <span className="font-semibold text-foreground">{creatorName}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign</Label>
            <Select
              value={campaignId}
              onValueChange={setCampaignId}
              disabled={campaignsLoading}
            >
              <SelectTrigger className="bg-background/50 border-muted focus:border-emerald-500/50">
                <SelectValue
                  placeholder={
                    campaignsLoading
                      ? "Fetching campaigns..."
                      : campaignsError
                      ? "Failed to load campaigns"
                      : "Select the campaign for this offer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {campaignsLoading && (
                  <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching campaigns…
                  </div>
                )}
                {campaignsError && (
                  <div className="px-3 py-2 text-sm text-red-500">
                    {campaignsError}
                  </div>
                )}
                {!campaignsLoading && !campaignsError && campaigns.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No campaigns found. Create one to send offers.
                  </div>
                )}
                {!campaignsLoading &&
                  !campaignsError &&
                  campaigns.length > 0 &&
                  campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {campaignsLoading && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Fetching your campaigns…
              </p>
            )}
            {campaignsError && (
              <p className="text-xs text-red-500">{campaignsError}</p>
            )}
            {!campaignsLoading &&
              !campaignsError &&
              campaigns.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No campaigns yet. Head to Campaigns to create one.
                </p>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Budget (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 bg-background/50 border-muted focus:border-emerald-500/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 border-muted hover:bg-muted/50",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-muted focus:border-emerald-500/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Deliverables</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddDeliverable}
                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 h-8"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {deliverables.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Deliverable ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      handleDeliverableChange(index, e.target.value)
                    }
                    className="bg-background/50 border-muted focus:border-emerald-500/50"
                  />
                  {deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
