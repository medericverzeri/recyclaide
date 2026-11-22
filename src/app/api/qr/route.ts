import QRCode from "qrcode";

export const dynamic = "force-dynamic";

// Génère un QR code PNG à partir de ?text=... (utilisé sur les cartes salariés)
export async function GET(req: Request) {
  const text = new URL(req.url).searchParams.get("text") || "https://recyclaide.fr";
  try {
    const buf = await QRCode.toBuffer(text, {
      margin: 1,
      width: 320,
      color: { dark: "#24313a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return new Response("QR error", { status: 500 });
  }
}
