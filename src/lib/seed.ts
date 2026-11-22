import { ENT_IMG } from "./ent-images";

// Image embarquée (data-URI) si dispo, sinon chemin d'origine
const E = (p: string): string => ENT_IMG[p] ?? p;

import type {
  SettingsData,
  PageRow,
  Mission,
  Album,
  EnterpriseData,
  ReviewData,
  TopicData,
  ContactCardData,
  Employee,
} from "./types";

// ---------------------------------------------------------------------------
// Contenu par défaut du site Recycl'Aide (données réelles de la structure).
// Ce contenu est inséré en base au premier démarrage (seed idempotent) et
// peut être entièrement modifié depuis l'espace admin.
// ---------------------------------------------------------------------------

export const DEFAULT_SETTINGS: SettingsData = {
  siteName: "Recycl'Aide",
  personName: "Marc",
  personFullName: "Marc",
  initials: "M",
  role: "Encadrant technique d'insertion · Recycl'Aide",
  tagline: "Collecte · Reconditionnement · Prix solidaire",
  location: "Beauvais (Oise)",
  heroLead:
    "Marc encadre le chantier d'insertion Recycl'Aide : collecte, livraison et remise en état d'aides techniques (fauteuils roulants, lits médicalisés, déambulateurs…) revendues ensuite à prix solidaire dans l'Oise.",
  logo: "/logo-recyclaide.png",
  heroImage: "/images/hero-marc.jpg",
  heroAlt: "Marc, encadrant technique du chantier d'insertion Recycl'Aide, dans l'atelier",
  statusMode: "auto",
  statusOverride: "",
  email: "recyclaide@eco-solidaire.fr",
  phone: "03 44 80 25 25",
  phoneHref: "tel:+33344802525",
  mobile: "06 17 46 02 37",
  mobileHref: "tel:+33617460237",
  addressLines: ["13 avenue Pierre Bérégovoy", "60000 Beauvais"],
  city: "Beauvais (Oise)",
  externalUrl: "https://recyclaide.fr",
  externalLabel: "recyclaide.fr",
  googleUrl: "https://www.google.com/maps/search/Recycl'Aide+Beauvais+avis",
  googleRating: "5,0",
  googleReviewsCount: "12 avis",
  hours: [
    {
      day: "Lundi",
      closed: false,
      rdvOnly: false,
      slots: [
        { label: "Dépôt & collecte", from: "9h00", to: "12h00" },
        { label: "Dépôt & collecte", from: "13h30", to: "17h00" },
      ],
      note: "Boutique fermée le lundi : dépôts de matériel uniquement.",
    },
    {
      day: "Mardi",
      closed: false,
      rdvOnly: false,
      slots: [
        { label: "Dépôt & collecte", from: "9h00", to: "12h00" },
        { label: "Boutique", from: "14h00", to: "17h00" },
      ],
      note: "Enlèvement à domicile possible sur rendez-vous.",
    },
    {
      day: "Mercredi",
      closed: false,
      rdvOnly: false,
      slots: [
        { label: "Dépôt & collecte", from: "9h00", to: "12h00" },
        { label: "Boutique", from: "14h00", to: "17h00" },
      ],
      note: "",
    },
    {
      day: "Jeudi",
      closed: false,
      rdvOnly: false,
      slots: [
        { label: "Dépôt & collecte", from: "9h00", to: "12h00" },
        { label: "Boutique", from: "14h00", to: "17h00" },
      ],
      note: "",
    },
    {
      day: "Vendredi",
      closed: false,
      rdvOnly: false,
      slots: [
        { label: "Dépôt & collecte", from: "9h00", to: "12h00" },
        { label: "Boutique", from: "14h00", to: "17h00" },
      ],
      note: "",
    },
    {
      day: "Samedi",
      closed: false,
      rdvOnly: false,
      slots: [{ label: "Boutique", from: "14h00", to: "17h00" }],
      note: "Dépôts de matériel sur rendez-vous le samedi.",
    },
    { day: "Dimanche", closed: true, rdvOnly: false, slots: [], note: "" },
  ],
  ticker: [
    "Collecte gratuite à domicile sur rendez-vous",
    "Aides techniques reconditionnées, contrôlées et garanties",
    "Vente & location à prix solidaire",
    "Dépôt possible dans 7 déchèteries partenaires de l'Oise",
    "Chaque achat finance un emploi en parcours d'insertion",
    "Boutique ouverte du mardi au samedi de 14h à 17h",
  ],
  nav: [
    { label: "Accueil", href: "/" },
    { label: "À propos de Marc", href: "/a-propos" },
    { label: "Entreprises du groupe", href: "/nos-entreprises" },
    { label: "Galerie", href: "/galerie" },
    { label: "Contactez-nous", href: "/contact" },
  ],
  colors: {
    brand: "#3d4e58",
    brandDeep: "#24313a",
    accent: "#e10b1a",
    page: "#fbf9f6",
  },
  seo: {
    title: "Recycl'Aide — Aides techniques reconditionnées à prix solidaire | Beauvais (Oise)",
    description:
      "Chantier d'insertion Recycl'Aide (Oise) : collecte, livraison et remise en état d'aides techniques — fauteuils roulants, lits médicalisés, déambulateurs, cannes… — revendues à prix solidaire. Vente et location.",
  },
  footerNote:
    "Association Recycl'Aide · Chantier d'insertion · La Maison d'économie solidaire · Aucun outil de suivi publicitaire",
};

export const DEFAULT_PAGES: PageRow[] = [
  {
    slug: "accueil",
    eyebrow: "Économie circulaire · Beauvais (Oise)",
    title: "Le réemploi des aides techniques",
    lead: "",
    blocks: [],
  },
  {
    slug: "a-propos",
    eyebrow: "01",
    title: "À propos de Marc",
    lead:
      "Encadrant technique d'insertion, Marc assure l'encadrement et l'accompagnement des salariés en insertion du chantier Recycl'Aide, tout en garantissant le bon fonctionnement de la collecte, de l'atelier et de la boutique.",
    blocks: [
      {
        kind: "text",
        title: "Encadrant technique d'insertion",
        paragraphs: [
          "Mon rôle est d'assurer l'encadrement et l'accompagnement des salariés en insertion dans leur parcours professionnel, tout en garantissant le bon fonctionnement du chantier Recycl'Aide : collecte des aides techniques, remise en état en atelier et vente à prix solidaire.",
          "J'allie management de proximité, transmission des savoir-faire et organisation des activités afin de concilier qualité de service, sécurité et économies solidaires.",
          "Je suis également en charge de l'accueil des donateurs et des clients de la boutique, et j'encadre les tournées de collecte et de livraison dans tout le département de l'Oise.",
          "Chaque aide technique collectée est contrôlée, nettoyée, aseptisée et réparée si besoin, puis proposée à la vente ou à la location à un coût réduit : l'absence d'équipement adapté ou un reste à charge trop élevé ne devraient jamais être un frein à l'autonomie.",
        ],
      },
      {
        kind: "list",
        title: "Mes principales missions",
        items: [
          "Encadrer et accompagner les salariés en insertion dans le développement de leurs compétences.",
          "Organiser la collecte des aides techniques (points de collecte, enlèvements à domicile, déchèteries partenaires).",
          "Superviser la remise en état en atelier : nettoyage, aseptisation, réparation, contrôle qualité et sécurité.",
          "Accueillir et conseiller les clients de la boutique (vente et location à prix solidaire).",
          "Organiser les livraisons et installations de matériel à domicile dans l'Oise.",
          "Sensibiliser les usagers aux enjeux du réemploi, de l'économie circulaire et de l'inclusion.",
        ],
      },
      {
        kind: "cards",
        title: "Trois terrains d'action",
        intro:
          "Le chantier Recycl'Aide ne se limite pas à l'atelier : il s'exerce aussi sur le terrain, chez les donateurs, et en boutique auprès des clients.",
        cards: [
          {
            title: "Collecte & enlèvement",
            text: "Récupération des aides techniques inutilisées ou destinées au rebut, chez les particuliers, les établissements de santé et les déchèteries partenaires.",
            bullets: [
              "Dépôt dans 7 points de collecte en déchèterie (SMDO)",
              "Enlèvement gratuit à domicile sur rendez-vous",
              "Collecte en établissement de santé et EHPAD",
            ],
            ctaLabel: "Organiser une collecte",
            ctaHref: "/collecte",
          },
          {
            title: "Remise en état en atelier",
            text: "Au sein du chantier d'insertion, chaque matériel est remis en bon état d'usage avant d'être proposé à la vente ou à la location.",
            bullets: [
              "Nettoyage et aseptisation complets",
              "Réparation, réglage et contrôle sécurité",
              "Garantie sur le matériel reconditionné",
            ],
            ctaLabel: "Découvrir l'atelier",
            ctaHref: "/reconditionnement",
          },
          {
            title: "Vente & location à prix solidaire",
            text: "Les aides techniques reconditionnées sont revendues à moindre coût, ou proposées à la location, pour rester accessibles à tous.",
            bullets: [
              "Prix solidaires défiant toute concurrence",
              "Essai et conseils en boutique",
              "Aide à la recherche de financements possibles",
            ],
            ctaLabel: "Voir la boutique",
            ctaHref: "/vente-location",
          },
        ],
      },
      {
        kind: "stats",
        items: [
          { value: "7", label: "points de collecte en déchèterie" },
          { value: "60", label: "département de l'Oise couvert" },
          { value: "100 %", label: "du matériel contrôlé et aseptisé" },
          { value: "0 €", label: "pour la collecte à domicile" },
        ],
      },
    ],
  },
  {
    slug: "nos-entreprises",
    eyebrow: "03",
    title: "Les entreprises du groupe MES",
    lead:
      "Un réseau de structures d'économie sociale et solidaire réunies autour de l'insertion, du réemploi et du territoire. Faites défiler le carrousel pour découvrir chaque entreprise.",
    blocks: [
      {
        kind: "enterprises",
        title: "Groupe MES",
        intro:
          "La Maison d'économie solidaire rassemble des structures engagées pour l'insertion, le réemploi et l'économie circulaire sur le territoire. Recycl'Aide en fait partie.",
      },
    ],
  },
  {
    slug: "galerie",
    eyebrow: "04",
    title: "Galerie",
    lead: "Ouvrez un album pour parcourir les photos de l'atelier, des collectes et de la boutique Recycl'Aide.",
    blocks: [{ kind: "gallery", title: "Albums photos", intro: "Atelier de reconditionnement, tournées de collecte et aides techniques disponibles en boutique." }],
  },
  {
    slug: "contact",
    eyebrow: "05",
    title: "Contactez-nous",
    lead: "Une question sur un matériel, un don à faire, une livraison ? Choisissez le moyen qui vous convient.",
    blocks: [
      { kind: "contact-cards", title: "Le bon contact pour votre demande", intro: "" },
      { kind: "topics", title: "À votre écoute, pour répondre à vos besoins.", intro: "Vos informations pratiques, en un clic." },
      { kind: "hours", title: "Horaires d'ouverture" },
      { kind: "form", title: "Formulaire de contact", intro: "Nous vous répondons au plus vite." },
    ],
  },
  {
    slug: "mentions-legales",
    eyebrow: "Informations légales",
    title: "Mentions légales",
    lead: "",
    blocks: [
      {
        kind: "raw",
        html: `<h2>Éditeur du site</h2>
<p><strong>Recycl'Aide</strong> — association loi 1901, atelier et chantier d'insertion (ACI).<br>
Adresse : 13 avenue Pierre Bérégovoy, 60000 Beauvais (Oise) — hébergé au Comptoir C.<br>
SIREN : 909 166 829 — SIRET : 909 166 829 00012.<br>
Email : <a href="mailto:recyclaide@eco-solidaire.fr">recyclaide@eco-solidaire.fr</a> — Tél. : 03 44 80 25 25.</p>
<h2>Objet du site</h2>
<p>Ce site présente l'activité du chantier d'insertion Recycl'Aide : collecte, livraison et remise en état d'aides techniques médicales, revendues à prix solidaire (vente et location) dans le département de l'Oise.</p>
<h2>Hébergement</h2>
<p>Site hébergé par Vercel (États-Unis) ; données stockées sur une base PostgreSQL Neon (hébergement UE). Aucun outil de suivi publicitaire n'est utilisé.</p>
<h2>Données personnelles</h2>
<p>Les informations envoyées via le formulaire de contact (nom, email, téléphone, message) servent uniquement à répondre à votre demande et ne sont transmises à aucun tiers. Vous pouvez demander leur suppression à l'adresse email ci-dessus.</p>
<h2>Propriété intellectuelle</h2>
<p>Les contenus, textes, photos et logo Recycl'Aide sont la propriété de l'association. Toute reproduction sans autorisation est interdite.</p>`,
      },
    ],
  },
];

export const DEFAULT_MISSIONS: Omit<Mission, "id" | "published" | "order">[] = [
  {
    slug: "collecte",
    eyebrow: "Collecte & enlèvement",
    title: "Vos aides techniques ont de la valeur : déposez-les, ou nous venons les chercher.",
    lead:
      "Vous possédez des aides techniques inutilisées, en bon état ou réparables ? Déposez-les dans l'un de nos points de collecte ou contactez-nous pour un enlèvement à domicile (gratuit, sur rendez-vous, limité à un enlèvement par donateur particulier).",
    data: {
      lead: "Un processus solidaire et une démarche qualité : chaque don est valorisé et contribue à financer des emplois en parcours d'insertion.",
      ctas: [
        { label: "Demander un enlèvement", href: "/contact", variant: "primary" },
        { label: "Appeler le chantier", href: "tel:+33344802525", variant: "ghost" },
      ],
      stats: [
        { value: "7", label: "points de collecte en déchèterie" },
        { value: "0 €", label: "pour un enlèvement à domicile" },
        { value: "60", label: "Oise : département couvert" },
      ],
      features: [
        { icon: "♻", title: "Points de collecte en déchèterie", text: "Déposez vos aides techniques dans les espaces réemploi de 7 déchèteries partenaires du SMDO dans l'Oise." },
        { icon: "⌂", title: "Enlèvement à domicile", text: "Sur rendez-vous, nous venons chercher le matériel chez vous, gratuitement (un enlèvement par donateur particulier)." },
        { icon: "▣", title: "Collecte en établissement", text: "Nous intervenons auprès des établissements de santé, EHPAD et professionnels pour récupérer le matériel inutilisé." },
        { icon: "✚", title: "Tout type d'aides techniques", text: "Fauteuils roulants, déambulateurs, cadres de marche, cannes, lits médicalisés, lève-personnes, matériel de salle de bains…" },
      ],
      steps: [
        { title: "Choisissez votre mode de dépôt", text: "Point de collecte en déchèterie, dépôt à la boutique, ou enlèvement à domicile sur rendez-vous." },
        { title: "Nous assurons le transport", text: "Nos équipes récupèrent et acheminent le matériel jusqu'à notre atelier de Beauvais." },
        { title: "Le matériel est reconditionné", text: "Nettoyage, aseptisation, réparation et contrôle qualité réalisés par les salariés en insertion." },
        { title: "Il retrouve une seconde vie", text: "Revendu à prix solidaire ou loué : chaque achat finance l'emploi et l'accompagnement des personnes en insertion." },
      ],
      warning: {
        title: "Avant de donner",
        text: "Pensez à vider les réservoirs (oxygène), retirer les batteries quand c'est possible, et joindre les notices ou accessoires (chargeur, télécommande, coussin…). Un doute sur l'état du matériel ? Contactez-nous avant de vous déplacer.",
      },
      outro: {
        title: "Vous avez du matériel à donner ?",
        text: "Appelez-nous au 03 44 80 25 25 ou écrivez à recyclaide@eco-solidaire.fr pour organiser la collecte.",
      },
    },
  },
  {
    slug: "reconditionnement",
    eyebrow: "Remise en état en atelier",
    title: "Chaque aide technique est contrôlée, nettoyée, réparée et garantie.",
    lead:
      "Dans notre atelier de Beauvais (Comptoir C), les salariés en insertion du chantier remettent en bon état d'usage tout le matériel collecté : nettoyage, aseptisation, réparation, réglage et contrôle sécurité.",
    data: {
      lead: "Un reconditionnement exigeant, réalisé par des professionnels formés, pour un matériel sûr, propre et fiable.",
      ctas: [
        { label: "Voir le matériel disponible", href: "/vente-location", variant: "primary" },
        { label: "Nous contacter", href: "/contact", variant: "ghost" },
      ],
      stats: [
        { value: "100 %", label: "du matériel nettoyé et aseptisé" },
        { value: "4", label: "étapes de contrôle qualité" },
        { value: "60", label: "types de matériel traités" },
      ],
      features: [
        { icon: "✦", title: "Nettoyage & aseptisation", text: "Désinfection complète de chaque appareil, conformément aux bonnes pratiques d'hygiène du matériel médical." },
        { icon: "⚙", title: "Réparation & réglage", text: "Remplacement des pièces usées, réglage des freins, des roues, des mécanismes électriques et des structures." },
        { icon: "✓", title: "Contrôle qualité & sécurité", text: "Vérification des points de sécurité (freins, ceintures, stabilité, charge maximale) avant toute remise en vente." },
        { icon: "◆", title: "Garantie", text: "Le matériel reconditionné bénéficie d'une garantie : en cas de souci, nous réparons ou échangeons." },
      ],
      steps: [
        { title: "Réception & tri", text: "Le matériel collecté est réceptionné, identifié et évalué à l'atelier." },
        { title: "Nettoyage & aseptisation", text: "Démontage des pièces, nettoyage approfondi et désinfection de l'appareil." },
        { title: "Réparation si nécessaire", text: "Remplacement des pièces défectueuses et réglage de l'ensemble." },
        { title: "Contrôle final & mise en vente", text: "Dernier contrôle sécurité, puis mise en boutique à prix solidaire." },
      ],
      warning: {
        title: "Un métier d'insertion",
        text: "Chaque aide technique reconditionnée est le fruit du travail des salariés en parcours d'insertion du chantier : en achetant chez Recycl'Aide, vous soutenez directement leur retour à l'emploi durable.",
      },
      outro: {
        title: "Envie de visiter l'atelier ?",
        text: "Venez nous rencontrer à la boutique, 13 avenue Pierre Bérégovoy à Beauvais, du mardi au samedi de 14h à 17h.",
      },
    },
  },
  {
    slug: "vente-location",
    eyebrow: "Vente & location à prix solidaire",
    title: "Achetez ou louez votre matériel à prix solidaire.",
    lead:
      "Fauteuils roulants manuels ou électriques, lits médicalisés, déambulateurs, cannes, sièges de douche… tout le matériel reconditionné est proposé à la vente à moindre coût, et à la location, dans notre boutique de Beauvais.",
    data: {
      lead: "Parce qu'un équipement adapté ne devrait jamais dépendre du budget : des prix solidaires, des conseils personnalisés et des essais en boutique.",
      ctas: [
        { label: "Venir à la boutique", href: "/contact", variant: "primary" },
        { label: "Voir les avis Google", href: "https://www.google.com/maps/search/Recycl'Aide+Beauvais+avis", variant: "ghost" },
      ],
      stats: [
        { value: "-60 %", label: "en moyenne vs le neuf" },
        { value: "2", label: "formules : achat ou location" },
        { value: "14h–17h", label: "du mardi au samedi" },
      ],
      features: [
        { icon: "◆", title: "Prix solidaires", text: "Des tarifs bien inférieurs au neuf, pour rendre l'équipement accessible aux personnes en précarité comme à tous." },
        { icon: "☺", title: "Accueil & conseils", text: "Marc et l'équipe vous accueillent, vous écoutent et vous conseillent pour choisir le matériel adapté à vos besoins." },
        { icon: "⌂", title: "Essai en boutique", text: "Venez essayer le matériel en boutique avant de vous décider." },
        { icon: "⚖", title: "Aide au financement", text: "Nous vous accompagnons dans la recherche d'aides au financement (reste à charge, aides départementales, mutuelles…)." },
      ],
      steps: [
        { title: "Passez à la boutique", text: "13 avenue Pierre Bérégovoy, 60000 Beauvais — du mardi au samedi de 14h à 17h." },
        { title: "Essayez et choisissez", text: "Fauteuil roulant, lit médicalisé, déambulateur… testez le matériel et prenez le temps de la réflexion." },
        { title: "Achetez ou louez", text: "Réglez à prix solidaire, ou optez pour la location courte ou longue durée." },
        { title: "Nous livrons si besoin", text: "Livraison et installation possibles à domicile dans tout l'Oise." },
      ],
      warning: {
        title: "Besoin d'un conseil ?",
        text: "Avant d'acheter, appelez-nous au 03 44 80 25 25 : nous vous aiderons à définir le matériel réellement adapté (dimensions, morphologie, logement, aides au financement).",
      },
      outro: {
        title: "À votre écoute, pour répondre à vos besoins.",
        text: "Une question sur un prix, une disponibilité, une livraison ? Écrivez-nous : recyclaide@eco-solidaire.fr",
      },
    },
  },
];

export const DEFAULT_ALBUMS: Omit<Album, "id" | "photos">[] = [
  {
    slug: "atelier-reconditionnement",
    title: "L'atelier de reconditionnement",
    description: "Nettoyage, aseptisation, réparation et contrôle qualité réalisés par les salariés en insertion.",
    order: 0,
  },
  {
    slug: "collecte-livraison",
    title: "Collecte & livraison",
    description: "Tournées de collecte chez les donateurs et livraisons à domicile dans tout l'Oise.",
    order: 1,
  },
  {
    slug: "boutique-aides-techniques",
    title: "La boutique & les aides techniques",
    description: "Le matériel reconditionné proposé à la vente et à la location à prix solidaire.",
    order: 2,
  },
];

export const DEFAULT_PHOTOS: { albumSlug: string; src: string; alt: string; caption: string; order: number }[] = [
  { albumSlug: "atelier-reconditionnement", src: "/images/atelier-1.jpg", alt: "Réparation d'un équipement en atelier", caption: "Réparation en atelier", order: 0 },
  { albumSlug: "atelier-reconditionnement", src: "/images/atelier-2.jpg", alt: "Poste de travail de reconditionnement", caption: "Poste de contrôle", order: 1 },
  { albumSlug: "atelier-reconditionnement", src: "/images/atelier-3.jpg", alt: "Technicien réparant un matériel", caption: "Réglage d'un fauteuil", order: 2 },
  { albumSlug: "atelier-reconditionnement", src: "/images/atelier-4.jpg", alt: "Atelier de reconditionnement du chantier", caption: "L'atelier", order: 3 },
  { albumSlug: "atelier-reconditionnement", src: "/images/atelier-5.jpg", alt: "Deux salariés en insertion en atelier", caption: "Les salariés du chantier", order: 4 },
  { albumSlug: "collecte-livraison", src: "/images/collecte-1.jpg", alt: "Chargement du matériel dans le véhicule de collecte", caption: "Enlèvement à domicile", order: 0 },
  { albumSlug: "collecte-livraison", src: "/images/collecte-2.jpg", alt: "Véhicule de livraison chargé", caption: "La tournée de livraison", order: 1 },
  { albumSlug: "collecte-livraison", src: "/images/collecte-3.jpg", alt: "Allée de l'entrepôt de stockage", caption: "L'entrepôt & la boutique de Beauvais", order: 2 },
  { albumSlug: "collecte-livraison", src: "/images/collecte-4.jpg", alt: "Chargement de matériel en entrepôt", caption: "Préparation des livraisons", order: 3 },
  { albumSlug: "collecte-livraison", src: "/images/collecte-5.jpg", alt: "Manutention de matériel lors d'une collecte", caption: "Manutention en collecte", order: 4 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-1.jpg", alt: "Fauteuil roulant utilisé au quotidien à domicile", caption: "Autonomie à domicile", order: 0 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-2.jpg", alt: "Fauteuil roulant dans un couloir", caption: "Fauteuil roulant reconditionné", order: 1 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-3.jpg", alt: "Personne en fauteuil roulant à l'intérieur", caption: "En boutique", order: 2 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-4.jpg", alt: "Béquilles appuyées contre un mur", caption: "Cannes & béquilles", order: 3 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-5.jpg", alt: "Déambulateur utilisé pour faire des courses", caption: "Déambulateur", order: 4 },
  { albumSlug: "boutique-aides-techniques", src: "/images/aides-6.jpg", alt: "Personne en fauteuil roulant en déplacement", caption: "Mobilité au quotidien", order: 5 },
];

export const DEFAULT_ENTERPRISES: Omit<EnterpriseData, "id" | "order">[] = [
  {
    name: "La Maison d'économie solidaire",
    tagline: "Le siège social",
    location: "",
    photo: E("/images/ent/ref/MAHP9uxt3lE.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHKtLJ1U8A.webp")],
    highlight: false,
  },
  {
    name: "Pays de Bray Service",
    tagline: "Service d'aide à la personne",
    location: "",
    photo: E("/images/ent/ref/MAGz2E_p3C0.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHP9ro8m9o.webp")],
    highlight: false,
  },
  {
    name: "Alicias",
    tagline: "Formations et accompagnement",
    location: "",
    photo: E("/images/ent/ref/MAGTteXqos0.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHP9vMI7xA.webp")],
    highlight: false,
  },
  {
    name: "Les Sens du Bray",
    tagline: "Constructeurs de solutions",
    location: "",
    photo: E("/images/ent/ref/MAHP9lNUFnk.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHP9GYeyyw.webp"), E("/images/ent/ref/MAHP9hnhYoA.webp")],
    highlight: false,
  },
  {
    name: "La recyclerie\nLachapelle-aux-Pots",
    tagline: "Boutique et réemploi",
    location: "",
    photo: E("/images/ent/ref/MAHP9h85zXU.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHP9siL3Fk.webp")],
    highlight: false,
  },
  {
    name: "La recyclerie\nGournay-en-Bray",
    tagline: "Boutique et réemploi",
    location: "",
    photo: E("/images/ent/ref/MAHP9iNqU8w.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHQDnpC0Gc.webp")],
    highlight: false,
  },
  {
    name: "Solitex Oise",
    tagline: "Le réemploi du textile",
    location: "",
    photo: E("/images/ent/ref/MAHP9rHSuds.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHP9pCj_7E.webp")],
    highlight: false,
  },
  {
    name: "Recycl'aide Oise",
    tagline: "Le réemploi des aides techniques",
    location: "Beauvais",
    photo: E("/images/ent/ref/MAHP9lY8M6A.webp"),
    photoContain: false,
    logos: [E("/logo-recyclaide.png")],
    highlight: true,
  },
  {
    name: "Matériosol",
    tagline: "L'économie circulaire des matériaux",
    location: "",
    photo: E("/images/ent/ref/MAHP90_NSFE.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHHOnURXyw.webp")],
    highlight: false,
  },
  {
    name: "Comptoir C\nEnsemble de services sur Beauvais",
    tagline: "Réemploi, réparation et services de proximité",
    location: "",
    photo: E("/images/ent/comptoir-c-illustration.webp"),
    photoContain: false,
    logos: [E("/images/ent/comptoir-c-logo.svg")],
    highlight: false,
  },
  {
    name: "Déchèt'Lab",
    tagline: "Déchèterie professionnelle · Beauvais",
    location: "",
    photo: E("/images/ent/ref/MAHQEPH4wJU.webp"),
    photoContain: false,
    logos: [E("/images/ent/ref/MAHQDsk7bis.webp")],
    highlight: false,
  },
  {
    name: "BatiRE",
    tagline: "Réemploi des matériaux du bâtiment",
    location: "",
    photo: E("/images/ent/partners/batire_logo.webp"),
    photoContain: true,
    logos: [E("/images/ent/partners/batire_logo.webp")],
    highlight: false,
  },
];

// Salariés (cartes identifiantes imprimables depuis l'espace admin)
export const DEFAULT_EMPLOYEES: Omit<Employee, "id" | "order" | "createdAt">[] = [
  {
    ref: "RA-2026-0001",
    nom: "DUPONT",
    prenom: "Marie",
    poste: "Salariée en insertion — Chantier de reconditionnement",
    validUntil: "31/12/2026",
    photo: "",
  },
];

// Avis laissés sur Google (mis en avant sur le site, modifiables dans l'admin)
export const DEFAULT_REVIEWS: Omit<ReviewData, "id" | "order">[] = [
  {
    author: "Marjorie Fournier",
    meta: "6 avis",
    rating: 5,
    dateText: "il y a 2 mois",
    text: "Toujours à l'écoute des clients, toujours satisfaite. Merci pour votre réactivité et votre investissement bien cordialement",
    visited: "Visité en août",
    photosCount: 0,
    isNew: false,
    color: "#1a73e8",
  },
  {
    author: "lussigny sandrine",
    meta: "12 avis · 2 photos",
    rating: 5,
    dateText: "il y a un jour",
    text: "Un accueil chaleureux, une écoute, des conseils, tout ça à des prix défiant toute concurrence, merci Marc pour votre disponibilité",
    visited: "Visité en novembre",
    photosCount: 2,
    isNew: true,
    color: "#e8710a",
  },
];

export const DEFAULT_TOPICS: Omit<TopicData, "id" | "order">[] = [
  {
    icon: "♿",
    title: "Matériel accepté",
    kicker: "Recycl'Aide · Catalogue",
    heading: "Quels matériels acceptez-vous ?",
    intro: "Nous collectons tous les équipements facilitant le confort de vie et les soins à domicile des personnes fragilisées par l'âge, le handicap ou la maladie.",
    steps: [
      "Fauteuils roulants manuels et électriques, fauteuils releveurs.",
      "Déambulateurs, cadres de marche, cannes et béquilles.",
      "Lits médicalisés, lève-personnes, sièges de douche, chaises pot, tables à roulettes.",
    ],
    warningTitle: "État du matériel",
    warningText: "Le matériel doit être en bon état général ou réparable. Pensez à retirer batteries et réservoirs d'oxygène, et à joindre chargeurs et accessoires.",
    ctaLabel: "Poser une question sur un matériel",
    ctaHref: "mailto:recyclaide@eco-solidaire.fr?subject=Question%20mat%C3%A9riel%20accept%C3%A9",
    ctaNote: "",
    mailtoSubject: "Question matériel accepté",
  },
  {
    icon: "♻",
    title: "Dépôt & collecte",
    kicker: "Recycl'Aide · Dons",
    heading: "Comment déposer ou donner du matériel ?",
    intro: "Trois façons de nous confier vos aides techniques inutilisées : c'est gratuit, et chaque don est reconditionné puis revendu à prix solidaire.",
    steps: [
      "Déposez le matériel dans l'un des 7 points de collecte en déchèterie partenaire (SMDO).",
      "Déposez-le directement à la boutique : 13 avenue Pierre Bérégovoy, 60000 Beauvais (Comptoir C).",
      "Demandez un enlèvement gratuit à domicile sur rendez-vous (limité à un enlèvement par donateur particulier).",
    ],
    warningTitle: "Avant de vous déplacer",
    warningText: "Appelez avant au 03 44 80 25 25 ou écrivez à recyclaide@eco-solidaire.fr pour confirmer l'acceptation de votre matériel.",
    ctaLabel: "Organiser une collecte",
    ctaHref: "/collecte",
    ctaNote: "",
    mailtoSubject: "Demande de collecte",
  },
  {
    icon: "◷",
    title: "Horaires",
    kicker: "Recycl'Aide · Informations pratiques",
    heading: "Quels sont les horaires d'ouverture ?",
    intro: "Retrouvez ci-dessous les créneaux d'accueil de la boutique et des dépôts.",
    steps: [
      "Dépôts & collecte : du lundi au vendredi de 9h00 à 12h00 et de 13h30 à 17h00.",
      "Boutique (vente & location) : du mardi au samedi de 14h00 à 17h00.",
      "Dimanche : fermé. Enlèvements à domicile uniquement sur rendez-vous.",
    ],
    warningTitle: "À noter",
    warningText: "La boutique est fermée le lundi : seuls les dépôts de matériel y sont possibles ce jour-là.",
    ctaLabel: "Nous appeler",
    ctaHref: "tel:+33344802525",
    ctaNote: "",
    mailtoSubject: "Question horaires",
  },
  {
    icon: "◆",
    title: "Prix solidaires",
    kicker: "Recycl'Aide · Tarifs",
    heading: "Quels sont les prix ?",
    intro: "Tout le matériel reconditionné est proposé à la vente à prix solidaire — bien en dessous du neuf — et peut aussi être loué.",
    steps: [
      "Prix solidaires affichés en boutique, souvent 60 % moins cher que le neuf.",
      "Location possible pour un besoin temporaire (convalescence, essai…).",
      "Aide à la recherche de financements (reste à charge, aides, mutuelles) sur demande.",
    ],
    warningTitle: "Devis sur demande",
    warningText: "Chaque situation est différente : appelez-nous pour un devis adapté à votre besoin et à votre budget.",
    ctaLabel: "Demander un devis",
    ctaHref: "mailto:recyclaide@eco-solidaire.fr?subject=Demande%20de%20devis",
    ctaNote: "",
    mailtoSubject: "Demande de devis",
  },
  {
    icon: "⇄",
    title: "Location",
    kicker: "Recycl'Aide · Location",
    heading: "Proposez-vous la location de matériel ?",
    intro: "Oui : pour un besoin ponctuel ou évolutif, la location d'aides techniques reconditionnées est possible.",
    steps: [
      "Location courte ou longue durée selon le besoin.",
      "Matériel reconditionné, contrôlé et garanti, comme à la vente.",
      "Livraison et installation à domicile possibles dans l'Oise.",
    ],
    warningTitle: "Disponibilités",
    warningText: "Le stock évolue chaque semaine : appelez la boutique pour vérifier la disponibilité du matériel recherché.",
    ctaLabel: "Vérifier une disponibilité",
    ctaHref: "tel:+33617460237",
    ctaNote: "",
    mailtoSubject: "Disponibilité location",
  },
  {
    icon: "➤",
    title: "Livraison",
    kicker: "Recycl'Aide · Livraison",
    heading: "Livrez-vous à domicile ?",
    intro: "Oui, dans tout le département de l'Oise : nous livrons et installons le matériel acheté ou loué chez vous.",
    steps: [
      "Livraison à domicile dans les 60 (Oise), sur rendez-vous.",
      "Installation et réglage du matériel inclus.",
      "Reprise de l'ancien matériel possible lors de la livraison.",
    ],
    warningTitle: "Prévoir",
    warningText: "Prévoyez un accès adapté (porte, escalier, ascenseur) et la présence d'un adulte lors de la livraison.",
    ctaLabel: "Organiser une livraison",
    ctaHref: "/contact",
    ctaNote: "",
    mailtoSubject: "Demande de livraison",
  },
  {
    icon: "…",
    title: "Autre question",
    kicker: "Recycl'Aide · Contact",
    heading: "Une autre question ?",
    intro: "N'hésitez pas à nous contacter, nous vous répondrons au plus vite.",
    steps: ["Écrivez-nous à recyclaide@eco-solidaire.fr.", "Ou appelez la boutique au 03 44 80 25 25 (mobile 06 17 46 02 37)."],
    warningTitle: "",
    warningText: "",
    ctaLabel: "Envoyer un email",
    ctaHref: "mailto:recyclaide@eco-solidaire.fr",
    ctaNote: "",
    mailtoSubject: "Question",
  },
];

export const DEFAULT_CONTACTS: Omit<ContactCardData, "id" | "order">[] = [
  {
    label: "Vente, location & conseils",
    person: "Marc",
    description:
      "Pour toute question sur le matériel disponible en boutique, les prix solidaires, la location, une livraison ou un enlèvement, contactez Marc, encadrant du chantier d'insertion.",
    email: "recyclaide@eco-solidaire.fr",
    phone: "03 44 80 25 25",
  },
  {
    label: "Dons de matériel & collecte",
    person: "L'équipe Recycl'Aide",
    description:
      "Pour donner des aides techniques, déposer du matériel ou organiser une collecte à domicile, contactez l'équipe.",
    email: "recyclaide@eco-solidaire.fr",
    phone: "06 17 46 02 37",
  },
];
