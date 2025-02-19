CREATE TABLE "harchi-categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "harchi-products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"title" text,
	"description" text,
	"price" text,
	"code" text,
	"off" text,
	"special_off" integer,
	"og_image" text,
	"category" text,
	"colors" text,
	"brand" text,
	"gender" text,
	"size" text,
	"material" text,
	"created_at" text DEFAULT '2025-02-05T10:03:53.238Z',
	"updated_at" text
);
--> statement-breakpoint
CREATE TABLE "harchi-users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"full_name" text,
	"email" text,
	"password" text,
	"pin" text DEFAULT 'empty',
	"phone_number" text,
	"role" text DEFAULT 'user',
	"created_at" text,
	"updated_at" text,
	"address" text,
	"city" text,
	"state" text,
	"lat" text,
	"lng" text
);
--> statement-breakpoint
DROP TABLE "mftplus-categories" CASCADE;--> statement-breakpoint
DROP TABLE "mftplus-users" CASCADE;