"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ApprovedTestimonial = {
  id: string;
  created_at: string;
  name: string;
  organization: string | null;
  rating: number;
  message: string;
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<ApprovedTestimonial[]>([]);
  const [tLoading, setTLoading] = useState(true);
  const [tError, setTError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      setTLoading(true);
      setTError(null);

      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });

        const ct = res.headers.get("content-type") || "";
        const raw = await res.text();
        if (!ct.includes("application/json")) {
          throw new Error(`Non-JSON (HTTP ${res.status}): ${raw.slice(0, 80)}`);
        }

        const json = raw ? JSON.parse(raw) : null;
        if (!res.ok || !json?.ok) throw new Error(json?.error || `HTTP ${res.status}`);

        setTestimonials((json.data || []) as ApprovedTestimonial[]);
      } catch (e: any) {
        setTError(e?.message || "Gagal load testimonials");
      } finally {
        setTLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="relative z-10 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            TESTIMONIALS
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            Cerita dari client yang sudah pernah kerja bareng Happy Friends ✨
          </p>

          <div className="mt-6">
            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              Tulis Testimoni
            </Link>
          </div>
        </div>

        {tError && <p className="text-center text-red-600">{tError}</p>}
        {tLoading && <p className="text-center text-gray-600">Loading testimonials...</p>}

        {!tLoading && !tError && testimonials.length === 0 && (
          <p className="text-center text-gray-600">Belum ada testimoni yang di-approve.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-3xl bg-white p-6 shadow-xl border-2 border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-gray-900">
                    {t.name}{t.organization ? ` — ${t.organization}` : ""}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="text-sm font-black text-yellow-500">
                  {"★".repeat(Math.max(0, Math.min(5, t.rating)))}
                </div>
              </div>

              <p className="mt-4 text-gray-800 leading-relaxed">{t.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
