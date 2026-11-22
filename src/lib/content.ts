import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_SETTINGS,
  DEFAULT_PAGES,
  DEFAULT_MISSIONS,
  DEFAULT_ALBUMS,
  DEFAULT_PHOTOS,
  DEFAULT_ENTERPRISES,
  DEFAULT_REVIEWS,
  DEFAULT_TOPICS,
  DEFAULT_CONTACTS,
} from "./seed";
import { IMAGE_DATA } from "./image-data";
import { ENT_IMG } from "./ent-images";

// ---------------------------------------------------------------------------
// Images embarquées : chaque fichier de public/ est aussi seedé dans la table
// `media` et servi via /api/media/[id] — comme ça les images s'affichent en
// ligne (Vercel + Neon) même si les fichiers statiques ne sont pas déployés.
// ---------------------------------------------------------------------------

function mediaIdFor(path: string): string {
  return "img" + path.replace(/[^a-zA-Z0-9]/g, "_");
}

const PATH_TO_MEDIA_URL: Record<string, string> = {};
for (const path of Object.keys(IMAGE_DATA)) {
  PATH_TO_MEDIA_URL[path] = `/api/media/${mediaIdFor(path)}`;
}

export function entUrl(path: string): string {
  return ENT_IMG[path] ?? mediaUrl(path);
}

export function mediaUrl(path: string): string {
  return PATH_TO_MEDIA_URL[path] ?? path;
}

function remapPaths<T>(obj: T): T {
  let json = JSON.stringify(obj);
  for (const [path, url] of Object.entries(PATH_TO_MEDIA_URL)) {
    json = json.split(JSON.stringify(path)).join(JSON.stringify(url));
  }
  return JSON.parse(json);
}

const SEED_SETTINGS = remapPaths(DEFAULT_SETTINGS);
const SEED_PAGES = remapPaths(DEFAULT_PAGES);
const SEED_MISSIONS = remapPaths(DEFAULT_MISSIONS);
const SEED_ALBUMS = remapPaths(DEFAULT_ALBUMS);
const SEED_PHOTOS = remapPaths(DEFAULT_PHOTOS);
const SEED_ENTERPRISES = remapPaths(DEFAULT_ENTERPRISES);
const SEED_REVIEWS = remapPaths(DEFAULT_REVIEWS);
const SEED_TOPICS = remapPaths(DEFAULT_TOPICS);
const SEED_CONTACTS = remapPaths(DEFAULT_CONTACTS);

import type {
  AdminContent,
  Album,
  EnterpriseData,
  MessageData,
  MediaItem,
  Mission,
  PageRow,
  Photo,
  ReviewData,
  SettingsData,
  SiteBundle,
  TopicData,
  ContactCardData,
} from "./types";

// ---------------------------------------------------------------------------
// Couche d'accès au contenu. Le site public lit la base à chaque requête
// (rendu dynamique) : toute modification faite dans /admin est visible
// immédiatement. On appelle aussi revalidatePath après chaque sauvegarde.
// ---------------------------------------------------------------------------

const SEED_LOCK = 727272;

// DDL de secours : permet à l'app de créer elle-même les tables au premier
// démarrage (utile sur Neon/Vercel où `drizzle-kit push` n'est pas exécuté).
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "kv" ("key" text PRIMARY KEY, "value" jsonb NOT NULL, "updated_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "settings" ("id" integer PRIMARY KEY DEFAULT 1, "data" jsonb NOT NULL, "updated_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "pages" ("slug" text PRIMARY KEY, "eyebrow" text NOT NULL DEFAULT '', "title" text NOT NULL, "lead" text NOT NULL DEFAULT '', "blocks" jsonb NOT NULL DEFAULT '[]'::jsonb, "updated_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "missions" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "slug" text NOT NULL UNIQUE, "eyebrow" text NOT NULL DEFAULT '', "title" text NOT NULL, "lead" text NOT NULL DEFAULT '', "data" jsonb NOT NULL, "published" boolean NOT NULL DEFAULT true, "order" integer NOT NULL DEFAULT 0, "updated_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "albums" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "title" text NOT NULL, "slug" text NOT NULL UNIQUE, "description" text NOT NULL DEFAULT '', "order" integer NOT NULL DEFAULT 0, "updated_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "photos" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "album_id" integer NOT NULL REFERENCES "albums"("id") ON DELETE CASCADE, "src" text NOT NULL, "alt" text NOT NULL DEFAULT '', "caption" text NOT NULL DEFAULT '', "order" integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS "enterprises" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "name" text NOT NULL, "tagline" text NOT NULL DEFAULT '', "location" text NOT NULL DEFAULT '', "highlight" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS "reviews" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "author" text NOT NULL, "meta" text NOT NULL DEFAULT '', "rating" integer NOT NULL DEFAULT 5, "date_text" text NOT NULL DEFAULT '', "text" text NOT NULL DEFAULT '', "visited" text NOT NULL DEFAULT '', "photos_count" integer NOT NULL DEFAULT 0, "is_new" boolean NOT NULL DEFAULT false, "color" text NOT NULL DEFAULT '#1a73e8', "order" integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS "topics" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "icon" text NOT NULL DEFAULT '✦', "title" text NOT NULL, "kicker" text NOT NULL DEFAULT '', "heading" text NOT NULL DEFAULT '', "intro" text NOT NULL DEFAULT '', "steps" jsonb NOT NULL DEFAULT '[]'::jsonb, "warning_title" text NOT NULL DEFAULT '', "warning_text" text NOT NULL DEFAULT '', "cta_label" text NOT NULL DEFAULT '', "cta_href" text NOT NULL DEFAULT '', "cta_note" text NOT NULL DEFAULT '', "mailto_subject" text NOT NULL DEFAULT '', "order" integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS "contacts" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "label" text NOT NULL, "person" text NOT NULL DEFAULT '', "description" text NOT NULL DEFAULT '', "email" text NOT NULL DEFAULT '', "phone" text NOT NULL DEFAULT '', "order" integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS "messages" ("id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "name" text NOT NULL, "email" text NOT NULL, "phone" text NOT NULL DEFAULT '', "subject" text NOT NULL DEFAULT '', "message" text NOT NULL, "read" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS "media" ("id" text PRIMARY KEY, "name" text NOT NULL, "mime" text NOT NULL, "size" integer NOT NULL, "data" bytea NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now());
;
ALTER TABLE "enterprises" ADD COLUMN IF NOT EXISTS "photo" text NOT NULL DEFAULT '';
ALTER TABLE "enterprises" ADD COLUMN IF NOT EXISTS "photo_contain" boolean NOT NULL DEFAULT false;
ALTER TABLE "enterprises" ADD COLUMN IF NOT EXISTS "logos" jsonb NOT NULL DEFAULT '[]'::jsonb;
`;

async function ensureSchema(): Promise<void> {
  await db.execute(sql.raw(SCHEMA_SQL));
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function seedAll(tx: Tx): Promise<void> {
  // 1) médias embarqués -> table media (idempotent)
  for (const [path, img] of Object.entries(IMAGE_DATA)) {
    const buf = Buffer.from(img.data, "base64");
    await tx
      .insert(schema.media)
      .values({ id: mediaIdFor(path), name: path.split("/").pop() ?? path, mime: img.mime, size: buf.length, data: buf })
      .onConflictDoNothing();
  }
  // 2) contenu avec URLs /api/media/...
  await tx
    .insert(schema.settings)
    .values({ id: 1, data: SEED_SETTINGS })
    .onConflictDoNothing();

  for (const p of SEED_PAGES) {
    await tx
      .insert(schema.pages)
      .values({ slug: p.slug, eyebrow: p.eyebrow, title: p.title, lead: p.lead, blocks: p.blocks })
      .onConflictDoNothing();
  }

  for (const [i, m] of SEED_MISSIONS.entries()) {
    await tx
      .insert(schema.missions)
      .values({
        slug: m.slug,
        eyebrow: m.eyebrow,
        title: m.title,
        lead: m.lead,
        data: m.data,
        published: true,
        order: i,
      })
      .onConflictDoNothing();
  }

  for (const [i, a] of SEED_ALBUMS.entries()) {
    await tx
      .insert(schema.albums)
      .values({ title: a.title, slug: a.slug, description: a.description, order: i })
      .onConflictDoNothing();
  }

  const albumRows = await tx.select({ id: schema.albums.id, slug: schema.albums.slug }).from(schema.albums);
  const albumBySlug = new Map(albumRows.map((r) => [r.slug, r.id]));
  for (const p of SEED_PHOTOS) {
    const albumId = albumBySlug.get(p.albumSlug);
    if (!albumId) continue;
    await tx
      .insert(schema.photos)
      .values({ albumId, src: p.src, alt: p.alt, caption: p.caption, order: p.order })
      .onConflictDoNothing();
  }

  for (const [i, e] of SEED_ENTERPRISES.entries()) {
    await tx
      .insert(schema.enterprises)
      .values({
        name: e.name,
        tagline: e.tagline,
        location: e.location,
        photo: e.photo,
        photoContain: e.photoContain,
        logos: e.logos,
        highlight: e.highlight,
        order: i,
      })
      .onConflictDoNothing();
  }

  for (const [i, r] of SEED_REVIEWS.entries()) {
    await tx
      .insert(schema.reviews)
      .values({
        author: r.author,
        meta: r.meta,
        rating: r.rating,
        dateText: r.dateText,
        text: r.text,
        visited: r.visited,
        photosCount: r.photosCount,
        isNew: r.isNew,
        color: r.color,
        order: i,
      })
      .onConflictDoNothing();
  }

  for (const [i, t] of SEED_TOPICS.entries()) {
    await tx
      .insert(schema.topics)
      .values({
        icon: t.icon,
        title: t.title,
        kicker: t.kicker,
        heading: t.heading,
        intro: t.intro,
        steps: t.steps,
        warningTitle: t.warningTitle,
        warningText: t.warningText,
        ctaLabel: t.ctaLabel,
        ctaHref: t.ctaHref,
        ctaNote: t.ctaNote,
        mailtoSubject: t.mailtoSubject,
        order: i,
      })
      .onConflictDoNothing();
  }

  for (const [i, c] of SEED_CONTACTS.entries()) {
    await tx
      .insert(schema.contacts)
      .values({ label: c.label, person: c.person, description: c.description, email: c.email, phone: c.phone, order: i })
      .onConflictDoNothing();
  }
}

// Version du seed : à chaque changement de version, le contenu est re-seeding
// (tables de contenu vidées puis réinsérées, médias embarqués upsertés).
// Évite qu'un ancien déploiement laisse un contenu périmé (ex : anciennes
// URLs d'images /images/... au lieu de /api/media/...).
const SEED_VERSION = "v4";

async function doEnsureSeeded(): Promise<void> {
  try {
    await ensureSchema();
    await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(${SEED_LOCK})`);
      const rows = await tx
        .select({ key: schema.kv.key, value: schema.kv.value })
        .from(schema.kv)
        .where(eq(schema.kv.key, "seeded"));
      const version = (rows[0]?.value as { version?: string } | undefined)?.version;
      if (version !== SEED_VERSION) {
        // re-seed complet (messages, médias et kv conservés)
        await tx.delete(schema.pages);
        await tx.delete(schema.photos);
        await tx.delete(schema.albums);
        await tx.delete(schema.missions);
        await tx.delete(schema.enterprises);
        await tx.delete(schema.reviews);
        await tx.delete(schema.topics);
        await tx.delete(schema.contacts);
        await tx.delete(schema.settings);
        await seedAll(tx);
        const value = { version: SEED_VERSION, at: new Date().toISOString() };
        await tx
          .insert(schema.kv)
          .values({ key: "seeded", value })
          .onConflictDoUpdate({ target: schema.kv.key, set: { value, updatedAt: new Date() } });
        console.log(`[content] seed ${SEED_VERSION} appliqué (re-seed)`);
      }
    });
  } catch (err) {
    console.warn("[content] ensureSeeded a échoué (la base est peut-être indisponible) :", err);
  }
}

// Exécuté une seule fois par processus (évite un DDL à chaque requête).
let seededOnce: Promise<void> | null = null;
export function ensureSeeded(): Promise<void> {
  if (!seededOnce) seededOnce = doEnsureSeeded();
  return seededOnce;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[content] lecture DB échouée, valeur par défaut utilisée :", err);
    return fallback;
  }
}

export async function getSettings(): Promise<SettingsData> {
  await ensureSeeded();
  return safe(async () => {
    const rows = await db.select().from(schema.settings).where(eq(schema.settings.id, 1)).limit(1);
    return rows[0]?.data ?? SEED_SETTINGS;
  }, SEED_SETTINGS);
}

export async function getPages(): Promise<PageRow[]> {
  await ensureSeeded();
  return safe(
    async () =>
      (await db.select().from(schema.pages).orderBy(asc(schema.pages.slug))).map((r) => ({
        slug: r.slug,
        eyebrow: r.eyebrow,
        title: r.title,
        lead: r.lead,
        blocks: r.blocks,
      })),
    SEED_PAGES
  );
}

export async function getMissions(publishedOnly = false): Promise<Mission[]> {
  await ensureSeeded();
  return safe(async () => {
    const rows = await db.select().from(schema.missions).orderBy(asc(schema.missions.order), asc(schema.missions.id));
    return rows
      .filter((r) => (publishedOnly ? r.published : true))
      .map((r) => ({
        id: r.id,
        slug: r.slug,
        eyebrow: r.eyebrow,
        title: r.title,
        lead: r.lead,
        published: r.published,
        order: r.order,
        data: r.data,
      }));
  }, SEED_MISSIONS.map((m, i) => ({ ...m, id: i + 1, published: true, order: i })));
}

export async function getAlbums(): Promise<Album[]> {
  await ensureSeeded();
  return safe(async () => {
    const albumRows = await db.select().from(schema.albums).orderBy(asc(schema.albums.order), asc(schema.albums.id));
    const photoRows = await db.select().from(schema.photos).orderBy(asc(schema.photos.order), asc(schema.photos.id));
    return albumRows.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      description: a.description,
      order: a.order,
      photos: photoRows
        .filter((p) => p.albumId === a.id)
        .map((p): Photo => ({ id: p.id, src: p.src, alt: p.alt, caption: p.caption, order: p.order })),
    }));
  }, SEED_ALBUMS.map((a, i) => ({ ...a, id: i + 1, photos: SEED_PHOTOS.filter((p) => p.albumSlug === a.slug).map((p, j) => ({ id: j + 1, src: p.src, alt: p.alt, caption: p.caption, order: p.order })) })));
}

export async function getEnterprises(): Promise<EnterpriseData[]> {
  await ensureSeeded();
  return safe(
    async () =>
      (await db.select().from(schema.enterprises).orderBy(asc(schema.enterprises.order), asc(schema.enterprises.id))).map(
        (r): EnterpriseData => ({
          id: r.id,
          name: r.name,
          tagline: r.tagline,
          location: r.location,
          photo: r.photo,
          photoContain: r.photoContain,
          logos: r.logos,
          highlight: r.highlight,
          order: r.order,
        })
      ),
    SEED_ENTERPRISES.map((e, i) => ({ ...e, id: i + 1, order: i }) as EnterpriseData)
  );
}

export async function getReviews(): Promise<ReviewData[]> {
  await ensureSeeded();
  return safe(
    async () =>
      (await db.select().from(schema.reviews).orderBy(asc(schema.reviews.order), asc(schema.reviews.id))).map(
        (r): ReviewData => ({
          id: r.id,
          author: r.author,
          meta: r.meta,
          rating: r.rating,
          dateText: r.dateText,
          text: r.text,
          visited: r.visited,
          photosCount: r.photosCount,
          isNew: r.isNew,
          color: r.color,
          order: r.order,
        })
      ),
    SEED_REVIEWS.map((r, i) => ({ ...r, id: i + 1, order: i }))
  );
}

export async function getTopics(): Promise<TopicData[]> {
  await ensureSeeded();
  return safe(
    async () =>
      (await db.select().from(schema.topics).orderBy(asc(schema.topics.order), asc(schema.topics.id))).map(
        (r): TopicData => ({
          id: r.id,
          icon: r.icon,
          title: r.title,
          kicker: r.kicker,
          heading: r.heading,
          intro: r.intro,
          steps: r.steps,
          warningTitle: r.warningTitle,
          warningText: r.warningText,
          ctaLabel: r.ctaLabel,
          ctaHref: r.ctaHref,
          ctaNote: r.ctaNote,
          mailtoSubject: r.mailtoSubject,
          order: r.order,
        })
      ),
    SEED_TOPICS.map((t, i) => ({ ...t, id: i + 1, order: i }))
  );
}

export async function getContacts(): Promise<ContactCardData[]> {
  await ensureSeeded();
  return safe(
    async () =>
      (await db.select().from(schema.contacts).orderBy(asc(schema.contacts.order), asc(schema.contacts.id))).map(
        (r): ContactCardData => ({ id: r.id, label: r.label, person: r.person, description: r.description, email: r.email, phone: r.phone, order: r.order })
      ),
    SEED_CONTACTS.map((c, i) => ({ ...c, id: i + 1, order: i }))
  );
}

export async function getSiteBundle(): Promise<SiteBundle> {
  const [settings, pages, missions, albums, enterprises, reviews, topics, contacts] = await Promise.all([
    getSettings(),
    getPages(),
    getMissions(true),
    getAlbums(),
    getEnterprises(),
    getReviews(),
    getTopics(),
    getContacts(),
  ]);
  const pagesMap: Record<string, PageRow> = {};
  for (const p of pages) pagesMap[p.slug] = p;
  return { settings, pages: pagesMap, missions, albums, enterprises, reviews, topics, contacts };
}

// ------------------------------ ADMIN --------------------------------------

export async function getMessages(): Promise<MessageData[]> {
  return safe(
    async () =>
      (await db.select().from(schema.messages).orderBy(sql`${schema.messages.createdAt} desc`)).map((r): MessageData => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        message: r.message,
        read: r.read,
        createdAt: r.createdAt.toISOString(),
      })),
    []
  );
}

export async function getMediaList(): Promise<MediaItem[]> {
  return safe(
    async () =>
      (await db.select({ id: schema.media.id, name: schema.media.name, mime: schema.media.mime, size: schema.media.size, createdAt: schema.media.createdAt }).from(schema.media).orderBy(sql`${schema.media.createdAt} desc`)).map(
        (r): MediaItem => ({ id: r.id, name: r.name, mime: r.mime, size: r.size, url: `/api/media/${r.id}`, createdAt: r.createdAt.toISOString() })
      ),
    []
  );
}

export async function getAllContent(): Promise<AdminContent> {
  const [settings, pages, missions, albums, enterprises, reviews, topics, contacts, messages, media] = await Promise.all([
    getSettings(),
    getPages(),
    getMissions(false),
    getAlbums(),
    getEnterprises(),
    getReviews(),
    getTopics(),
    getContacts(),
    getMessages(),
    getMediaList(),
  ]);
  return { settings, pages, missions, albums, enterprises, reviews, topics, contacts, messages, media };
}

function revalidateAll(): void {
  try {
    revalidatePath("/", "layout");
  } catch {
    // revalidatePath ne peut pas être appelé hors d'un contexte de requête :
    // le rendu dynamique rend de toute façon le site à jour à chaque requête.
  }
}

type SaveInput = Partial<AdminContent>;

export async function saveAllContent(input: SaveInput): Promise<AdminContent> {
  await ensureSeeded();
  await db.transaction(async (tx) => {
    if (input.settings) {
      await tx
        .insert(schema.settings)
        .values({ id: 1, data: input.settings, updatedAt: new Date() })
        .onConflictDoUpdate({ target: schema.settings.id, set: { data: input.settings, updatedAt: new Date() } });
    }
    if (input.pages) {
      await tx.delete(schema.pages);
      for (const p of input.pages) {
        await tx.insert(schema.pages).values({ slug: p.slug, eyebrow: p.eyebrow ?? "", title: p.title ?? "", lead: p.lead ?? "", blocks: p.blocks ?? [] });
      }
    }
    if (input.missions) {
      await tx.delete(schema.missions);
      for (const [i, m] of input.missions.entries()) {
        await tx.insert(schema.missions).values({
          slug: m.slug,
          eyebrow: m.eyebrow ?? "",
          title: m.title ?? "",
          lead: m.lead ?? "",
          data: m.data,
          published: m.published ?? true,
          order: m.order ?? i,
        });
      }
    }
    if (input.albums) {
      await tx.delete(schema.photos);
      await tx.delete(schema.albums);
      for (const [i, a] of input.albums.entries()) {
        const [row] = await tx
          .insert(schema.albums)
          .values({ title: a.title, slug: a.slug, description: a.description ?? "", order: a.order ?? i })
          .returning({ id: schema.albums.id });
        for (const [j, p] of (a.photos ?? []).entries()) {
          await tx.insert(schema.photos).values({ albumId: row.id, src: p.src, alt: p.alt ?? "", caption: p.caption ?? "", order: p.order ?? j });
        }
      }
    }
    if (input.enterprises) {
      await tx.delete(schema.enterprises);
      for (const [i, e] of input.enterprises.entries()) {
        await tx.insert(schema.enterprises).values({
          name: e.name,
          tagline: e.tagline ?? "",
          location: e.location ?? "",
          photo: e.photo ?? "",
          photoContain: !!e.photoContain,
          logos: e.logos ?? [],
          highlight: !!e.highlight,
          order: e.order ?? i,
        });
      }
    }
    if (input.reviews) {
      await tx.delete(schema.reviews);
      for (const [i, r] of input.reviews.entries()) {
        await tx.insert(schema.reviews).values({
          author: r.author,
          meta: r.meta ?? "",
          rating: r.rating ?? 5,
          dateText: r.dateText ?? "",
          text: r.text ?? "",
          visited: r.visited ?? "",
          photosCount: r.photosCount ?? 0,
          isNew: !!r.isNew,
          color: r.color ?? "#1a73e8",
          order: r.order ?? i,
        });
      }
    }
    if (input.topics) {
      await tx.delete(schema.topics);
      for (const [i, t] of input.topics.entries()) {
        await tx.insert(schema.topics).values({
          icon: t.icon ?? "✦",
          title: t.title,
          kicker: t.kicker ?? "",
          heading: t.heading ?? "",
          intro: t.intro ?? "",
          steps: t.steps ?? [],
          warningTitle: t.warningTitle ?? "",
          warningText: t.warningText ?? "",
          ctaLabel: t.ctaLabel ?? "",
          ctaHref: t.ctaHref ?? "",
          ctaNote: t.ctaNote ?? "",
          mailtoSubject: t.mailtoSubject ?? "",
          order: t.order ?? i,
        });
      }
    }
    if (input.contacts) {
      await tx.delete(schema.contacts);
      for (const [i, c] of input.contacts.entries()) {
        await tx.insert(schema.contacts).values({ label: c.label, person: c.person ?? "", description: c.description ?? "", email: c.email ?? "", phone: c.phone ?? "", order: c.order ?? i });
      }
    }
  });
  revalidateAll();
  return getAllContent();
}

export async function resetToDefaults(): Promise<AdminContent> {
  await db.transaction(async (tx) => {
    await tx.delete(schema.pages);
    await tx.delete(schema.photos);
    await tx.delete(schema.albums);
    await tx.delete(schema.missions);
    await tx.delete(schema.enterprises);
    await tx.delete(schema.reviews);
    await tx.delete(schema.topics);
    await tx.delete(schema.contacts);
    await tx.delete(schema.settings);
    await seedAll(tx);
  });
  revalidateAll();
  return getAllContent();
}

export async function addMessage(input: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
  await db.insert(schema.messages).values({
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    subject: input.subject ?? "",
    message: input.message,
  });
}

export async function setMessageRead(id: number, read: boolean): Promise<void> {
  await db.update(schema.messages).set({ read }).where(eq(schema.messages.id, id));
}

export async function deleteMessage(id: number): Promise<void> {
  await db.delete(schema.messages).where(eq(schema.messages.id, id));
}

export async function addMedia(input: { id: string; name: string; mime: string; size: number; data: Buffer }): Promise<MediaItem> {
  await db.insert(schema.media).values({ id: input.id, name: input.name, mime: input.mime, size: input.size, data: input.data });
  return { id: input.id, name: input.name, mime: input.mime, size: input.size, url: `/api/media/${input.id}`, createdAt: new Date().toISOString() };
}

export async function deleteMedia(id: string): Promise<void> {
  await db.delete(schema.media).where(eq(schema.media.id, id));
}

export async function getMediaRow(id: string) {
  const rows = await db.select().from(schema.media).where(eq(schema.media.id, id)).limit(1);
  return rows[0] ?? null;
}
