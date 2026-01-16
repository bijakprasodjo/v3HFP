"use client";

import type React from "react";
import { useState } from "react";
import { track } from "@/lib/analytics";

export default function InquiryForm() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formEl = e.currentTarget;

    setOkMsg(null);
    setErrMsg(null);
    setLoading(true);

    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());

    void track("submit_inquiry", {
      step: "attempt",
      service: String(payload.service || ""),
      has_email: Boolean(payload.email),
    });

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        void track("submit_inquiry", {
          step: "error",
          status: res.status,
          err: String(json?.error || `HTTP ${res.status}`),
        });
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      void track("submit_inquiry", { step: "success" });

      setOkMsg("Berhasil! Admin akan menghubungi kamu secepatnya.");
      formEl.reset();
    } catch (err: any) {
      void track("submit_inquiry", {
        step: "error",
        err: String(err?.message || "unknown"),
      });
      setErrMsg(err?.message || "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nama" className="rounded-xl border p-3" />
        <input name="organization" placeholder="Sekolah/Instansi" className="rounded-xl border p-3" />
        <input name="whatsapp" placeholder="No. WhatsApp" className="rounded-xl border p-3" />
        <input name="email" placeholder="Email (opsional)" className="rounded-xl border p-3" />
      </div>

      <input name="service" placeholder="Kebutuhan layanan" className="w-full rounded-xl border p-3" />

      <textarea
        name="message"
        required
        placeholder="Ceritain kebutuhan kamu"
        className="w-full rounded-xl border p-3"
        rows={4}
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Inquiry"}
      </button>

      {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}
      {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
    </form>
  );
}
