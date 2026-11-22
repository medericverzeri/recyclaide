# Déploiement gratuit : GitHub → Vercel + Neon (PostgreSQL)

Ce site est un projet **Next.js (App Router) + PostgreSQL via Drizzle ORM**, déployable gratuitement.

## 1. Base de données — Neon (gratuit)

1. Créez un compte sur [neon.tech](https://neon.tech) (plan **Free** : 0,5 Go, suffisant).
2. Créez un projet, choisissez la région **Europe (Frankfurt)** pour la latence.
3. Copiez la **connection string** (elle commence par `postgresql://...neon.tech/...`).

## 2. Code sur GitHub

1. Créez un dépôt GitHub (public ou privé) et poussez ce projet :
   ```bash
   git init && git add -A && git commit -m "Site Recycl'Aide"
   git remote add origin https://github.com/<vous>/recyclaide-site.git
   git push -u origin main
   ```

## 3. Déploiement — Vercel (gratuit, Hobby)

1. Sur [vercel.com](https://vercel.com), « Add New Project » → importez le dépôt GitHub.
2. Vercel détecte automatiquement Next.js. **Ne renseignez aucune variable tout de suite.**
3. Dans *Project Settings → Environment Variables*, ajoutez :
   | Variable | Valeur |
   |---|---|
   | `DATABASE_URL` | la connection string Neon (avec `?sslmode=require`) |
   | `ADMIN_EMAIL` | ex. `admin@recyclaide.fr` |
   | `ADMIN_PASSWORD` | mot de passe admin fort |
   | `SESSION_SECRET` | chaîne aléatoire longue (ex. générée avec `openssl rand -hex 32`) |
4. Déployez. Au premier démarrage, le schéma Drizzle est créé et le contenu par défaut de Recycl'Aide est inséré automatiquement (voir `src/instrumentation.ts` + `ensureSeeded()`).

> Pour appliquer le schéma manuellement : `npx drizzle-kit push` (avec `DATABASE_URL` en local).

## 4. Mise à jour automatique du site

- Toutes les pages publiques sont rendues **dynamiquement** (`force-dynamic`) et lisent la base à chaque requête.
- Depuis **/admin** (lien « Espace admin » en pied de page), toute modification est enregistrée en base puis `revalidatePath("/", "layout")` est appelé : **le site public est mis à jour instantanément**, sans redéploiement.
- Les images uploadées depuis l'admin sont stockées dans la base (table `media`) et servies via `/api/media/[id]` — compatible avec l'hébergement serverless de Vercel (système de fichiers en lecture seule).

## 5. Connexion à l'espace admin

- URL : `https://<votre-projet>.vercel.app/admin` (ou lien « Espace admin » en pied de page).
- Identifiants : `ADMIN_EMAIL` / `ADMIN_PASSWORD` définis sur Vercel.
- **Démo locale** (si les variables sont absentes) : `admin@recyclaide.fr` / `admin123`.
- En production, définissez impérativement vos propres `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `SESSION_SECRET` — ils remplacent les valeurs par défaut.
- Session : cookie signé en HMAC (`SESSION_SECRET`), valable 7 jours.

## 6. Limites du gratuit à connaître

- **Neon Free** : 0,5 Go de stockage, mise en pause après inactivité (le site se réveille automatiquement).
- **Vercel Hobby** : domaine `*.vercel.app`, 100 Go de bande passante/mois, fonctions serverless limitées — largement suffisant pour un site vitrine.
- Ajoutez un domaine perso dans Vercel → *Domains* si besoin.
