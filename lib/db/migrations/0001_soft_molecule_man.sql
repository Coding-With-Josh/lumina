ALTER TABLE "users" ADD COLUMN "account_type" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;