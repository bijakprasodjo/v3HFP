"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QuoteForm from "@/components/QuoteForm";
import { track } from "@/lib/analytics";

const LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp-removebg-preview-mWbCO2m0mEnyTiYjULaSWk7YyKUTKs.png";

export default function QuotesPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    void track("view_page", { page: "quotes" });

    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const openWhatsApp = () => {
    void track("click_whatsapp", { from: "quotes" });
    const phoneNumber = "628111224478";
    const message = "Halo min, aku mau request quotation (yearbook/photo/video). Bisa dibantu? 🙂";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #FF1493, #FF69B4)`,
            opacity: 0.1,
            transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #00BFFF, #1E90FF)`,
            opacity: 0.08,
            transform: `translate(${mouse.x * -0.01}px, ${mouse.y * -0.01}px)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #FFD700, #FFA500)`,
            opacity: 0.1,
            transform: `translate(${mouse.x * 0.015}px, ${mouse.y * 0.015}px)`,
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, #8A2BE2, #9370DB)`,
            opacity: 0.08,
            transform: `translate(${mouse.x * -0.02}px, ${mouse.y * 0.01}px)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[420px] h-[420px] opacity-[0.06] rotate-12"
            style={{
              backgroundImage: `url('${LOGO_URL}')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transform: `rotate(12deg) translate(${mouse.x * 0.005}px, ${mouse.y * 0.005}px)`,
            }}
          />
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Happy Friends Project" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <div className="font-black tracking-wide">HAPPY FRIENDS PROJECT</div>
            <div className="text-xs text-gray-600">#BEHAPPYWITHYOURFRIENDS</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50" href="/">
            Home
          </Link>
          <Link className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50" href="/testimonials">
            Testimonial
          </Link>
          <button
            onClick={openWhatsApp}
            className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            WhatsApp
          </button>
        </nav>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            {/* Left info */}
            <section className="rounded-3xl border bg-white/70 backdrop-blur-md p-6 shadow-sm">
              <h1 className="text-3xl font-black tracking-tight">Request Quotation</h1>
              <p className="mt-2 text-gray-600">
                Isi detail kebutuhan kamu, nanti sistem kasih <b>estimasi range harga</b> + <b>estimasi waktu</b>.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-2xl border bg-white p-4">
                  <div className="font-bold">Yang kamu dapat</div>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <div>✅ Range harga (min–max)</div>
                    <div>✅ Estimasi durasi pengerjaan (hari)</div>
                    <div>✅ Request kamu masuk admin buat follow up</div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-4">
                  <div className="font-bold">Tips biar estimasi akurat</div>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <div>• Isi jumlah siswa mendekati real</div>
                    <div>• Deadline jangan mepet (kalau mepet tulis di catatan)</div>
                    <div>• Jelasin kebutuhan (tema, lokasi, konsep) di catatan</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={openWhatsApp}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Tanya cepat via WhatsApp
                  </button>
                  <Link className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50" href="/">
                    Lihat Home
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-gradient-to-br from-purple-200 via-pink-200 to-sky-200 p-[1px] shadow-lg">
              <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700">Form Quotation</div>
                  <div className="text-xs text-gray-500">Isi sekali, nanti keluar estimasi otomatis 💸</div>
                </div>

                <QuoteForm />
              </div>
            </section>
          </div>

          <div className="mt-10 text-center text-xs text-gray-500">
            Happy Friends Project • Estimasi bersifat perkiraan awal, admin bisa follow up untuk detail final.
          </div>
        </div>
      </main>
    </div>
  );
}
