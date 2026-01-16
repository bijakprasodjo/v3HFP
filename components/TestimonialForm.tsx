"use client";

import { useState } from "react";
import type React from "react";
import { track } from "@/lib/analytics";

export default function TestimonialForm() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);
    setLoading(true);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const payload = {
      name: String(fd.get("name") || ""),
      organization: String(fd.get("organization") || ""),
      rating: Number(fd.get("rating") || 0),
      message: String(fd.get("message") || ""),
    };

    void track("submit_testimonial", { step: "attempt", rating: payload.rating });

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();
      if (!ct.includes("application/json")) {
        void track("submit_testimonial", { step: "error", status: res.status, err: "non-json" });
        throw new Error(`Non-JSON (HTTP ${res.status}): ${raw.slice(0, 80)}`);
      }

      const json = raw ? JSON.parse(raw) : null;
      if (!res.ok || !json?.ok) {
        void track("submit_testimonial", {
          step: "error",
          status: res.status,
          err: String(json?.error || `HTTP ${res.status}`),
        });
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      void track("submit_testimonial", { step: "success" });

      setOkMsg("Makasih! Testimoni kamu masuk antrian review admin 🙂");
      formEl.reset();
    } catch (err: any) {
      void track("submit_testimonial", { step: "error", err: String(err?.message || "unknown") });
      setErrMsg(err?.message || "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nama" className="rounded-xl border p-3" />
        <input name="organization" placeholder="Sekolah/Instansi (opsional)" className="rounded-xl border p-3" />
      </div>

      <select name="rating" required className="w-full rounded-xl border p-3">
        <option value="">Rating</option>
        <option value="5">5 - Mantap</option>
        <option value="4">4 - Bagus</option>
        <option value="3">3 - Oke</option>
        <option value="2">2 - Kurang</option>
        <option value="1">1 - Buruk</option>
      </select>

      <textarea name="message" required rows={4} placeholder="Tulis testimoni kamu" className="w-full rounded-xl border p-3" />

      <button disabled={loading} className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-60">
        {loading ? "Mengirim..." : "Kirim Testimoni"}
      </button>

      {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}
      {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
    </form>
  );
}
