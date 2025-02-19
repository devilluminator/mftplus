import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
//
dotenv.config({
  path: ".env.local",
});
export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./server/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
