import { pgTable, text, integer, boolean, timestamp, jsonb, customType } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
  toDriver: (v) => v,
  fromDriver: (v) => (Buffer.isBuffer(v) ? v : Buffer.from(v as Uint8Array)),
});
import type {
  SettingsData,
  PageRow,
  MissionData,
  TopicData,
  ReviewData,
  ContactCardData,
  EnterpriseData,
  PageBlock,
} from "@/lib/types";

export const kv = pgTable("kv", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").$type<SettingsData>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  slug: text("slug").primaryKey(),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  lead: text("lead").notNull().default(""),
  blocks: jsonb("blocks").$type<PageBlock[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const missions = pgTable("missions", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  slug: text("slug").notNull().unique(),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  lead: text("lead").notNull().default(""),
  data: jsonb("data").$type<MissionData>().notNull(),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const albums = pgTable("albums", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  order: integer("order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  albumId: integer("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  caption: text("caption").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const enterprises = pgTable("enterprises", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  location: text("location").notNull().default(""),
  photo: text("photo").notNull().default(""),
  photoContain: boolean("photo_contain").notNull().default(false),
  logos: jsonb("logos").$type<string[]>().notNull().default([]),
  highlight: boolean("highlight").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const reviews = pgTable("reviews", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  author: text("author").notNull(),
  meta: text("meta").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  dateText: text("date_text").notNull().default(""),
  text: text("text").notNull().default(""),
  visited: text("visited").notNull().default(""),
  photosCount: integer("photos_count").notNull().default(0),
  isNew: boolean("is_new").notNull().default(false),
  color: text("color").notNull().default("#1a73e8"),
  order: integer("order").notNull().default(0),
});

export const topics = pgTable("topics", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  icon: text("icon").notNull().default("✦"),
  title: text("title").notNull(),
  kicker: text("kicker").notNull().default(""),
  heading: text("heading").notNull().default(""),
  intro: text("intro").notNull().default(""),
  steps: jsonb("steps").$type<string[]>().notNull().default([]),
  warningTitle: text("warning_title").notNull().default(""),
  warningText: text("warning_text").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default(""),
  ctaHref: text("cta_href").notNull().default(""),
  ctaNote: text("cta_note").notNull().default(""),
  mailtoSubject: text("mailto_subject").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const contacts = pgTable("contacts", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  label: text("label").notNull(),
  person: text("person").notNull().default(""),
  description: text("description").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const employees = pgTable("employees", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  ref: text("ref").notNull().unique(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull().default(""),
  poste: text("poste").notNull().default(""),
  validUntil: text("valid_until").notNull().default(""),
  photo: text("photo").notNull().default(""),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type KvRow = typeof kv.$inferSelect;
export type SettingsRow = typeof settings.$inferSelect;
export type PageDbRow = typeof pages.$inferSelect;
export type MissionRow = typeof missions.$inferSelect;
export type AlbumRow = typeof albums.$inferSelect;
export type PhotoRow = typeof photos.$inferSelect;
export type EnterpriseRow = typeof enterprises.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type TopicRow = typeof topics.$inferSelect;
export type ContactRow = typeof contacts.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;
export type MediaRow = typeof media.$inferSelect;

export type { PageRow, MissionData, TopicData, ReviewData, ContactCardData, EnterpriseData, PageBlock };
