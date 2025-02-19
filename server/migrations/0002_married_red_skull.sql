ALTER TABLE "mftplus-users" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "mftplus-users" ADD COLUMN "pin" text;--> statement-breakpoint
ALTER TABLE "mftplus-users" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "mftplus-users" DROP COLUMN "deleted_at";