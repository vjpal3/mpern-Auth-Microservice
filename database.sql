CREATE DATABASE mpernauth;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE auth (
  authid SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

Alter table auth Alter Column password type VARCHAR(100);

CREATE TABLE profile (
  pid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  authid SERIAL REFERENCES auth,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  avatar TEXT,
  github VARCHAR(50),
  cohort VARCHAR(8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

