"use client";

import { useState } from "react";
import type React from "react";
import { track } from "@/lib/analytics";

type QuoteResult = {
  id?: string;
  price_min?: number;
  price_max?: number;
  eta_min_days?: number;
  eta_max_days?: number;
};

function rupiah(n?: number) {
  if (typeof n !== "number") return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
}

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);
    setResult(null);
    setLoading(true);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      name: String(form.get("name") || ""),
      organization: String(form.get("organization") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      email: String(form.get("email") || ""),

      package: String(form.get("package") || ""),
      students: Number(form.get("students") || 0),
      city: String(form.get("city") || ""),
      deadline: String(form.get("deadline") || ""),

      details: String(form.get("details") || ""),
    };

    void track("submit_quote", {
      step: "attempt",
      package: payload.package,
      students: payload.students,
      city: payload.city,
      has_email: Boolean(payload.email),
    });

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!ct.includes("application/json")) {
        void track("submit_quote", { step: "error", status: res.status, err: "non-json" });
        throw new Error(`API balikin non-JSON (HTTP ${res.status}). Snippet: ${raw.slice(0, 80)}`);
      }

      const json = raw ? JSON.parse(raw) : null;
      if (!res.ok || !json?.ok) {
        void track("submit_quote", {
          step: "error",
          status: res.status,
          err: String(json?.error || `HTTP ${res.status}`),
        });
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      const q = json.quote;

      setResult({
        id: q.id,
        price_min: q.price_min,
        price_max: q.price_max,
        eta_min_days: q.eta_min_days,
        eta_max_days: q.eta_max_days,
      });

      void track("submit_quote", { step: "success", request_id: String(q.id || "") });

      setOkMsg("Berhasil! Estimasi sudah dihitung & request tersimpan.");
      formEl.reset();
    } catch (err: any) {
      void track("submit_quote", { step: "error", err: String(err?.message || "unknown") });
      setErrMsg(err?.message || "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Nama" className="rounded-xl border p-3" />
          <input name="organization" placeholder="Sekolah/Instansi (opsional)" className="rounded-xl border p-3" />

          <input name="whatsapp" required placeholder="No. WhatsApp" className="rounded-xl border p-3" />
          <input name="email" placeholder="Email (opsional)" className="rounded-xl border p-3" />

          <select name="package" required className="rounded-xl border p-3">
            <option value="">Pilih paket</option>
            <option value="yearbook">Yearbook</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>

          <input
            name="students"
            type="number"
            min={1}
            required
            placeholder="Estimasi jumlah siswa"
            className="rounded-xl border p-3"
          />

          <input name="city" required placeholder="Lokasi / Kota" className="rounded-xl border p-3" />
          <input name="deadline" type="date" required className="rounded-xl border p-3" />
        </div>

        <textarea name="details" placeholder="Catatan tambahan (opsional)" className="w-full rounded-xl border p-3" rows={4} />

        <button disabled={loading} className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "Menghitung..." : "Request Quotation"}
        </button>

        {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}
        {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
      </form>

      {result && (
        <div className="mt-5 rounded-xl border bg-gray-50 p-4">
          <p className="font-semibold">Estimasi</p>
          <div className="mt-2 text-sm space-y-1">
            <div>Range harga: <b>{rupiah(result.price_min)} – {rupiah(result.price_max)}</b></div>
            <div>Estimasi waktu: <b>{result.eta_min_days} – {result.eta_max_days} hari</b></div>
            {result.id && <div>ID request: <b>{result.id}</b></div>}
          </div>
        </div>
      )}
    </div>
  );
}
