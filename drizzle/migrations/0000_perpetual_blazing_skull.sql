CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"bio" text,
	"image" text,
	"password" text NOT NULL,
	"username" text NOT NULL,
	"created_at" date DEFAULT CURRENT_DATE,
	"updated_at" date DEFAULT CURRENT_DATE,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
