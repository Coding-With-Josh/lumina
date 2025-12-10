import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  json,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: varchar('uuid', { length: 50 }).unique(),
  name: varchar('name', { length: 200 }),
  username: varchar('username', { length: 50 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  
  role: varchar('role', { length: 20 }).notNull().default('creator'), 
  accountType: varchar('account_type', { length: 20 }), // creator, brand, admin

  emailVerified: boolean('email_verified').default(false),
  phoneNumber: varchar('phone_number', { length: 20 }),
  phoneVerified: boolean('phone_verified').default(false),
  kycStatus: varchar('kyc_status', { length: 20 }).default('none'),

  profilePicture: text('profile_picture'),
  bio: text('bio'),
  country: varchar('country', { length: 50 }),
  timezone: varchar('timezone', { length: 50 }),

  twoFactorEnabled: boolean('two_factor').default(false),
  twoFactorSecret: text('two_factor_secret'),
  twoFactorBackupCodes: json('two_factor_backup_codes').$type<string[]>(),
  suspended: boolean('suspended').default(false),
  suspensionReason: text('suspension_reason'),
  
  status: varchar('status', { length: 20 }).default('offline'), // online, offline, away

  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const creatorProfiles = pgTable('creator_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),

  niche: varchar('niche', { length: 100 }),
  trustScore: integer('trust_score').default(50),
  earningsTotal: integer('earnings_total').default(0),
  earningsPending: integer('earnings_pending').default(0),
  earningsAvailable: integer('earnings_available').default(0),

  defaultCurrency: varchar('default_currency', { length: 10 }).default('USD'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const brandProfiles = pgTable('brand_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),

  companyName: varchar('company_name', { length: 200 }),
  billingEmail: varchar('billing_email', { length: 255 }),
  stripeCustomerId: text('stripe_customer_id'),
  defaultCurrency: varchar('default_currency', { length: 10 }).default('USD'),

  totalSpent: integer('total_spent').default(0),

  createdAt: timestamp('created_at').defaultNow(),
});

export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),

  platform: varchar('platform', { length: 20 }).notNull(), // instagram, tiktok, x, threads

  platformUserId: varchar('platform_user_id', { length: 100 }),
  username: varchar('username', { length: 100 }),
  displayName: varchar('display_name', { length: 200 }),

  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),

  followers: integer('followers').default(0),
  engagementRate: integer('engagement_rate').default(0),

  lastSyncedAt: timestamp('last_synced_at'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').notNull().references(() => users.id),

  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),

  questionnaire: text('questionnaire_json'),

  budget: integer('budget').notNull(),
  cpm: integer('cpm').notNull(),
  requiredViews: integer('required_views').notNull(),

  platforms: text('platforms_json'), // ["instagram","x","tiktok"]

  status: varchar('status', { length: 50 }).default('draft'), 
  visibility: varchar('visibility', { length: 50 }).default('public'),

  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const campaignParticipants = pgTable('campaign_participants', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id),
  creatorId: integer('creator_id').notNull().references(() => users.id),

  status: varchar('status', { length: 50 }).default('joined'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),

  participantId: integer('participant_id')
    .notNull()
    .references(() => campaignParticipants.id),

  platform: varchar('platform', { length: 20 }).notNull(),
  postUrl: text('post_url').notNull(),
  externalPostId: varchar('external_post_id', { length: 200 }),

  uploadedAt: timestamp('uploaded_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),

  status: varchar('status', { length: 50 }).default('pending'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const engagements = pgTable('engagements', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id),

  rawViews: integer('raw_views').default(0),
  validatedViews: integer('validated_views').default(0),

  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  watchTime: integer('watch_time').default(0),
  clickOffRate: integer('click_off_rate').default(0),

  fraudScore: integer('fraud_score').default(0),

  fetchedAt: timestamp('fetched_at').defaultNow(),
});

export const payouts = pgTable('payouts', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id').notNull().references(() => users.id),

  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),

  status: varchar('status', { length: 50 }).default('pending'),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),

  transactionId: varchar('transaction_id', { length: 200 }),
  payoutMethod: varchar('payout_method', { length: 20 }), // crypto, bank

  createdAt: timestamp('created_at').defaultNow(),
});

export const brandPayments = pgTable('brand_payments', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').notNull().references(() => users.id),

  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),

  stripePaymentId: varchar('stripe_payment_id', { length: 200 }),
  status: varchar('status', { length: 50 }).default('completed'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),

  title: varchar('title', { length: 200 }),
  body: text('body'),

  type: varchar('type', { length: 50 }),
  read: boolean('read').default(false),

  createdAt: timestamp('created_at').defaultNow(),
});

export const disputes = pgTable('disputes', {
  id: serial('id').primaryKey(),

  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').references(() => posts.id),

  type: varchar('type', { length: 50 }), // fraud, payout, platform
  message: text('message'),

  status: varchar('status', { length: 50 }).default('open'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const fraudLogs = pgTable('fraud_logs', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id),

  score: integer('score').notNull(),
  reason: text('reason'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').notNull().references(() => users.id),

  url: text('url').notNull(),
  secret: text('secret').notNull(),

  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const conversationParticipants = pgTable('conversation_participants', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .notNull()
    .references(() => conversations.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  lastReadAt: timestamp('last_read_at'),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .notNull()
    .references(() => conversations.id),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id')
    .notNull()
    .references(() => users.id),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  campaignId: integer('campaign_id').references(() => campaigns.id), // Optional: link to a campaign
  
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  
  status: varchar('status', { length: 50 }).default('pending'), // pending, accepted, rejected, completed, cancelled
  
  deliverables: text('deliverables_json'), // JSON array of deliverables
  
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Existing tables (preserved for compatibility)
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  creatorProfile: one(creatorProfiles, {
    fields: [users.id],
    references: [creatorProfiles.userId],
  }),
  brandProfile: one(brandProfiles, {
    fields: [users.id],
    references: [brandProfiles.userId],
  }),
  socialAccounts: many(socialAccounts),
  campaigns: many(campaigns), // as brand
  participations: many(campaignParticipants), // as creator
  payouts: many(payouts),
  notifications: many(notifications),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  brand: one(users, {
    fields: [campaigns.brandId],
    references: [users.id],
  }),
  participants: many(campaignParticipants),
}));

export const campaignParticipantsRelations = relations(campaignParticipants, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [campaignParticipants.campaignId],
    references: [campaigns.id],
  }),
  creator: one(users, {
    fields: [campaignParticipants.creatorId],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  participant: one(campaignParticipants, {
    fields: [posts.participantId],
    references: [campaignParticipants.id],
  }),
  engagements: many(engagements),
  fraudLogs: many(fraudLogs),
  disputes: many(disputes),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationParticipants.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [conversationParticipants.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  brand: one(users, {
    fields: [contracts.brandId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [contracts.creatorId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [contracts.campaignId],
    references: [campaigns.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
