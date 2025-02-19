CREATE TABLE "mftplus-users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text,
	"token" text,
	"phone_number" text,
	"role" text DEFAULT 'user',
	"created_at" text,
	"updated_at" text,
	"deleted_at" text,
	"address" text,
	"city" text,
	"state" text,
	"lat" text,
	"lng" text
);
--> statement-breakpoint
DROP TABLE "modelet-users" CASCADE;