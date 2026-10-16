CREATE TABLE IF NOT EXISTS "pilot_profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL UNIQUE,
  "age" integer NOT NULL,
  "path" text NOT NULL,
  "first_flight" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
