import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("harchi-users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  full_name: text("full_name"),
  email: text("email"),
  password: text("password"),
  pin: text("pin").default("empty"),
  phone_number: text("phone_number"),
  role: text("role").default("user"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  lat: text("lat").default("35.7665394"),
  lng: text("lng").default("51.4749824"),
});

export const categories = pgTable("harchi-categories", {
  id: serial("id").primaryKey(),
  name: text("name"),
  link: text("link"),
});

export const products = pgTable("harchi-products", {
  id: serial("id").primaryKey(),
  name: text("name"),
  title: text("title"),
  description: text("description"),
  price: text("price"),
  code: text("code"),
  off: text("off"),
  special_off: integer("special_off"), // 0 - 1 because in SQL we don't have boolean
  og_image: text("og_image"),
  category: text("category"),
  colors: text("colors"),
  brand: text("brand"),
  gender: text("gender"),
  size: text("size"),
  material: text("material"),
  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
});
