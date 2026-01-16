"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TestimonialForm from "@/components/TestimonialForm";
import { track } from "@/lib/analytics";

const LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp-removebg-preview-mWbCO2m0mEnyTiYjULaSWk7YyKUTKs.png";

export default function TestimonialsPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    void track("view_page", { page: "testimonials" });

    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const openWhatsApp = () => {
    void track("click_whatsapp", { from: "testimonials" });
    const phoneNumber = "628111224478";
    const message = "Halo min, aku mau nanya-nanya soal Happy Friends Project 🙂";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Background (mirip home) */}
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
          <Link className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50" href="/quotes">
            Request Quote
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
              <h1 className="text-3xl font-black tracking-tight">Testimonial</h1>
              <p className="mt-2 text-gray-600">
                Tulis pengalaman kamu bareng <b>Happy Friends</b>. Nanti admin approve dulu ya.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-2xl border bg-white p-4">
                  <div className="font-bold">Gimana prosesnya?</div>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <div>✅ Kamu isi form & kirim</div>
                    <div>🕒 Masuk antrian review admin (pending)</div>
                    <div>🌟 Kalau approved, bakal tampil di landing page</div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-4">
                  <div className="font-bold">Biar makin meyakinkan</div>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <div>• Sebut sekolah/instansi (opsional)</div>
                    <div>• Kasih rating + pesan singkat yang jujur</div>
                    <div>• Kalau ada momen/hasil yang paling kamu suka, tulis aja</div>
                  </div>
                </div>

              </div>
            </section>

            <section className="rounded-3xl bg-gradient-to-br from-purple-200 via-pink-200 to-sky-200 p-[1px] shadow-lg">
              <div className="rounded-3xl border bg-white/80 backdrop-blur-md p-6">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700">Form Testimoni</div>
                  <div className="text-xs text-gray-500">Isi yang bener yaa bre biar kece tampilnya 😄</div>
                </div>

                <TestimonialForm />
              </div>
            </section>
          </div>

          <div className="mt-10 text-center text-xs text-gray-500">
            Happy Friends Project • Testimonial akan tampil setelah approval admin.
          </div>
        </div>
      </main>
    </div>
  );
}
