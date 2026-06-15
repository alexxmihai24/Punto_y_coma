import type { Metadata } from "next";
import QRCode from "qrcode";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { BAR } from "@/data/info";

export const metadata: Metadata = {
  title: "Código QR de la carta",
  robots: { index: false },
};

export default async function QrPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base.replace(/\/$/, "")}/carta`;

  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0d070f", light: "#ffffff" },
  });

  return (
    <main className="min-h-dvh">
      <div className="container-px flex flex-wrap items-center justify-between gap-4 py-8 print:hidden">
        <Link href="/" className="text-sm text-muted hover:text-cream">
          ← Volver
        </Link>
        <div className="flex gap-3">
          <PrintButton />
        </div>
      </div>

      {/* Tarjeta imprimible */}
      <div className="container-px flex justify-center pb-16">
        <div id="qr-card" className="qr-card">
          <div className="qr-brand">
            Punto<span style={{ color: "#ff2d8e" }}>y</span>Coma
            <span style={{ opacity: 0.5 }}> ;</span>
          </div>
          <p className="qr-sub">Escanea para ver la carta y el menú del día</p>

          <div className="qr-box" dangerouslySetInnerHTML={{ __html: svg }} />

          <p className="qr-foot">{BAR.direccion} · {BAR.ciudad}</p>
          <p className="qr-url">{url.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>

      <style>{`
        .qr-card{width:100%;max-width:420px;background:#fff;color:#0d070f;border-radius:28px;padding:40px 36px;text-align:center;box-shadow:0 30px 80px -30px rgba(255,45,142,.6)}
        .qr-brand{font-family:var(--font-display),sans-serif;font-size:30px;font-weight:800;letter-spacing:-0.02em}
        .qr-sub{margin-top:8px;color:#6b5a73;font-size:15px}
        .qr-box{margin:26px auto 0;width:260px;height:260px}
        .qr-box svg{width:100%;height:100%;display:block}
        .qr-foot{margin-top:24px;font-weight:600;font-size:14px}
        .qr-url{margin-top:4px;color:#8a5cff;font-size:13px;word-break:break-all}
        @media print{
          body::before,body::after{display:none !important}
          body{background:#fff !important}
          .qr-card{box-shadow:none;border:1px solid #eee}
        }
      `}</style>
    </main>
  );
}
