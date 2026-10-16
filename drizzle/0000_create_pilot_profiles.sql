CREATE TABLE IF NOT EXISTS "pilot_profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "age" integer NOT NULL,
  "path" text NOT NULL,
  "first_flight" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "pilot_profiles_user_id_idx" ON "pilot_profiles" USING btree ("user_id");
