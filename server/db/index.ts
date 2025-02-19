import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.POSTGRES_URL!);
import * as schema from "./schema";
//
export const db = drizzle({ client: sql, schema: schema, logger: true });
