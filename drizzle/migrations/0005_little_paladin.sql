ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_users_id_fk";

ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_follower_id_users_id_fk";

ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_follower_id";
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_follower_id_pk" PRIMARY KEY("user_id","follower_id");
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;