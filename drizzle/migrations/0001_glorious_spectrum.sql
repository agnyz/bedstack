CREATE TABLE IF NOT EXISTS "user_follows" (
	"user_id" integer,
	"follower_id" integer,
	"created_at" date DEFAULT CURRENT_DATE,
	"updated_at" date DEFAULT CURRENT_DATE,
	CONSTRAINT user_follows_user_id_follower_id PRIMARY KEY("user_id","follower_id")
);

DO $$ BEGIN
 ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
