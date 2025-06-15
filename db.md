-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.post_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  post_id uuid,
  tag_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_tags_pkey PRIMARY KEY (id),
  CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  topic_id uuid NOT NULL,
  cover_image_url text,
  author_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  published boolean DEFAULT false,
  slug text NOT NULL UNIQUE,
  read_time integer,
  view_count integer DEFAULT 0,
  excerpt text,
  like_count integer DEFAULT 0,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT posts_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  social_links jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  post_count integer DEFAULT 0,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.topics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  post_count integer DEFAULT 0,
  CONSTRAINT topics_pkey PRIMARY KEY (id)
);



| table_name | column_name     | data_type                | is_nullable |
| ---------- | --------------- | ------------------------ | ----------- |
| posts      | id              | uuid                     | NO          |
| posts      | title           | text                     | NO          |
| posts      | content         | text                     | NO          |
| posts      | topic_id        | uuid                     | NO          |
| posts      | cover_image_url | text                     | YES         |
| posts      | author_id       | uuid                     | NO          |
| posts      | created_at      | timestamp with time zone | NO          |
| posts      | updated_at      | timestamp with time zone | NO          |
| posts      | published       | boolean                  | YES         |
| posts      | slug            | text                     | NO          |
| posts      | read_time       | integer                  | YES         |
| posts      | view_count      | integer                  | YES         |
| posts      | excerpt         | text                     | YES         |
| posts      | like_count      | integer                  | YES         |
| profiles   | id              | uuid                     | NO          |
| profiles   | username        | text                     | YES         |
| profiles   | full_name       | text                     | YES         |
| profiles   | avatar_url      | text                     | YES         |
| profiles   | bio             | text                     | YES         |
| profiles   | website         | text                     | YES         |
| profiles   | social_links    | jsonb                    | YES         |
| profiles   | created_at      | timestamp with time zone | NO          |
| profiles   | updated_at      | timestamp with time zone | NO          |
| tags       | id              | uuid                     | NO          |
| tags       | name            | text                     | NO          |
| tags       | slug            | text                     | NO          |
| tags       | post_count      | integer                  | YES         |
| topics     | id              | uuid                     | NO          |
| topics     | name            | text                     | NO          |
| topics     | slug            | text                     | NO          |
| topics     | icon            | text                     | YES         |
| topics     | post_count      | integer                  | YES         |


| table_schema | constraint_name     | table_name | column_name | foreign_table_name | foreign_column_name |
| ------------ | ------------------- | ---------- | ----------- | ------------------ | ------------------- |
| public       | posts_topic_id_fkey | posts      | topic_id    | topics             | id                  |



-- Essential indexes for posts table
CREATE INDEX idx_posts_slug ON public.posts(slug);  -- Critical for post lookups
CREATE INDEX idx_posts_published ON public.posts(published, created_at DESC) WHERE published = true;  -- Homepage queries
CREATE INDEX idx_posts_author_published ON public.posts(author_id, published, created_at DESC);  -- User profile pages
CREATE INDEX idx_posts_topic_published ON public.posts(topic_id, published, created_at DESC);  -- Topic pages

-- Essential indexes for junction tables
CREATE INDEX idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);
