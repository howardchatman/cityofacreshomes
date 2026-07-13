-- Run this once against your Neon database (Neon console -> SQL Editor)
-- before the petition/volunteer/contact forms will have anywhere to write to.

create table if not exists petition_signatures (
  id bigint generated always as identity primary key,
  name text not null,
  address text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists volunteers (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  interest text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  topic text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Handy queries once you have real data:
--   select count(*) from petition_signatures;
--   select * from petition_signatures order by created_at desc limit 50;
