CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"article_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "article_tags" (
	"article_id" integer NOT NULL,
	"tag_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "article_tags_article_id_tag_name_pk" PRIMARY KEY("article_id","tag_name")
);

CREATE TABLE "tags" (
	"name" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_name_tags_name_fk" FOREIGN KEY ("tag_name") REFERENCES "public"."tags"("name") ON DELETE cascade ON UPDATE no action;


-- Seed tags and article_tags before dropping tag_list column
INSERT INTO tags (name) SELECT DISTINCT unnest(tag_list) FROM articles;
INSERT INTO article_tags (article_id, tag_name) SELECT id, unnest(tag_list) FROM articles;

ALTER TABLE "articles" DROP COLUMN "tag_list";