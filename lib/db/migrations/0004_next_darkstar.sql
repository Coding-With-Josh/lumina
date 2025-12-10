CREATE TABLE "post_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"social_post_id" integer NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"watch_time" integer DEFAULT 0,
	"captured_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"platform" varchar(20) NOT NULL,
	"external_post_id" varchar(200) NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"media_type" varchar(50),
	"thumbnail_url" text,
	"posted_at" timestamp,
	"is_valid" boolean DEFAULT true,
	"synced_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "profile_picture_url" text;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "is_valid" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "post_metrics" ADD CONSTRAINT "post_metrics_social_post_id_social_posts_id_fk" FOREIGN KEY ("social_post_id") REFERENCES "public"."social_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;