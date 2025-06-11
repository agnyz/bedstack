ALTER TABLE "user_follows" RENAME COLUMN "user_id" TO "followed_id";
ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_users_id_fk";

ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_follower_id_pk";
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followed_id_follower_id_pk" PRIMARY KEY("followed_id","follower_id");
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followed_id_users_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;