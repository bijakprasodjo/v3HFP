"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrMsg(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow">
        <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6">Masuk untuk melihat inquiry.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Login"}
          </button>

          {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
        </form>
      </div>
    </div>
  );
}
