CREATE TYPE "urgency_flag" AS ENUM (
  'good',
  'Needs supply',
  'Needs shelter',
  'Needs veternary care',
  'Needs secure env'
);

CREATE TABLE "animal_spot" (
  "id" integer PRIMARY KEY,
  "last_seen" timestamp NOT NULL,
  "neighborhood" varchar(255) NOT NULL,
  "apartment" varchar(255) NOT NULL,
  "city" varchar(255) NOT NULL,
  "street" varchar(255) NOT NULL,
  "country" varchar(255) NOT NULL,
  "district" varchar(255) NOT NULL,
  "urgency_flag" urgency_flag DEFAULT 'good'
);

CREATE TABLE "animal" (
  "id" integer PRIMARY KEY,
  "breed" varchar(255) NOT NULL,
  "shelter_needed" boolean DEFAULT false,
  "adopted" boolean DEFAULT false,
  "animal_spot_id" integer NOT NULL REFERENCES "animal_spot"("id") ON DELETE CASCADE
);

CREATE TABLE "supply" (
  "id" integer PRIMARY KEY,
  "animal_spot_id" integer NOT NULL UNIQUE REFERENCES "animal_spot"("id") ON DELETE CASCADE,
  "expired_at" timestamp NOT NULL,
  "water_present" boolean NOT NULL,
  "food_present" boolean NOT NULL
);

CREATE TABLE "injury" (
  "id" integer PRIMARY KEY,
  "injury" varchar(255),
  "animal_id" integer NOT NULL REFERENCES "animal"("id") ON DELETE CASCADE
);

CREATE TABLE "registered" (
  "id" integer PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(255),
  "admin_flag" boolean DEFAULT false,
  "profile_photo_url" varchar(500)
);

CREATE TABLE "saved_animal_spot" (
  "registered_id" integer  NOT NULL REFERENCES "registered"("id") ON DELETE CASCADE,
  "animal_spot_id" integer  NOT NULL REFERENCES "animal_spot"("id") ON DELETE CASCADE,
  "saved_at" timestamp DEFAULT now(),
  PRIMARY KEY ("registered_id", "animal_spot_id")

);

-- animal_spot filters
CREATE INDEX idx_animal_spot_last_seen
ON "animal_spot" ("last_seen");

CREATE INDEX idx_animal_spot_urgency_flag
ON "animal_spot" ("urgency_flag");

CREATE INDEX idx_animal_spot_country_city_district
ON "animal_spot" ("country", "city", "district");

CREATE INDEX idx_animal_spot_city_district_neighborhood
ON "animal_spot" ("city", "district", "neighborhood");

-- animal lookups
CREATE INDEX idx_animal_animal_spot_id
ON "animal" ("animal_spot_id");

CREATE INDEX idx_animal_breed
ON "animal" ("breed");

CREATE INDEX idx_animal_adopted
ON "animal" ("adopted");

CREATE INDEX idx_animal_shelter_needed
ON "animal" ("shelter_needed");

CREATE INDEX idx_animal_spot_adopted
ON "animal" ("animal_spot_id", "adopted");

-- supply lookups
CREATE INDEX idx_supply_animal_spot_id
ON "supply" ("animal_spot_id");

CREATE INDEX idx_supply_expired_at
ON "supply" ("expired_at");

-- injury lookups
CREATE INDEX idx_injury_animal_id
ON "injury" ("animal_id");

CREATE INDEX idx_injury_injury
ON "injury" ("injury");

-- registered lookup
CREATE UNIQUE INDEX idx_registered_email
ON "registered" ("email");

-- saved animal spot lookups
CREATE INDEX idx_saved_animal_spot_registered_id
ON "saved_animal_spot" ("registered_id");

CREATE INDEX idx_saved_animal_spot_animal_spot_id
ON "saved_animal_spot" ("animal_spot_id");

CREATE INDEX idx_saved_animal_spot_saved_at
ON "saved_animal_spot" ("saved_at");


