import type { Metadata } from "next";
import AdminPrintPage from "../admin/cartes/imprimer/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Impression des cartes salariés", robots: { index: false, follow: false } };

// Alias racine de la page d'impression (même rendu que /admin/cartes/imprimer)
export default AdminPrintPage;
