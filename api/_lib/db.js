import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error(
    "No database connection string found. After connecting Neon in the Vercel " +
      "Storage tab, check your project's Environment Variables for the exact " +
      "name (commonly DATABASE_URL or POSTGRES_URL) and add it here if different."
  );
}

export const sql = neon(connectionString);

export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
