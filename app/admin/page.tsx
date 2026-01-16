"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  organization: string | null;
  whatsapp: string | null;
  email: string | null;
  service: string | null;
  message: string;
  status: "new" | "contacted" | "in_progress" | "done" | "spam";
  notes: string | null;
};

type QuoteRequest = {
  id: string;
  created_at: string;
  name: string;
  organization: string | null;
  whatsapp: string | null;
  email: string | null;

  package: "yearbook" | "photo" | "video";
  students: number;
  city: string;
  deadline: string; 
  details: string | null;

  price_min: number | null;
  price_max: number | null;
  eta_min_days: number | null;
  eta_max_days: number | null;

  status: string | null; 
  notes: string | null;  
};

type TestimonialRow = {
  id: string;
  created_at: string;
  name: string;
  organization: string | null;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
};

type AnalyticsRow = {
  id: string;
  created_at: string;
  event: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  meta: any;
};

type TabKey = "inquiries" | "quotes" | "testimonials" | "analytics";

export default function AdminPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [tab, setTab] = useState<TabKey>("inquiries");

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);

  const [savingId, setSavingId] = useState<string | null>(null);

  async function ensureAdminAndMaybeLoad(initial = false) {
    setErrMsg(null);
    if (initial) setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      router.push("/admin/login");
      router.refresh();
      return { ok: false as const };
    }

    setMe({ id: user.id, email: user.email ?? undefined });

    const { data: adminRow, error: adminErr } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminErr) {
      setErrMsg(adminErr.message);
      if (initial) setLoading(false);
      return { ok: false as const };
    }

    if (!adminRow) {
      setIsAdmin(false);
      setErrMsg("Akun ini belum terdaftar sebagai admin (cek tabel public.admins).");
      if (initial) setLoading(false);
      return { ok: false as const };
    }

    setIsAdmin(true);
    if (initial) setLoading(false);
    return { ok: true as const };
  }

  async function onLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function loadInquiries() {
    setErrMsg(null);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return setErrMsg(error.message);
    setInquiries((data ?? []) as any);
  }

  async function loadQuotes() {
    setErrMsg(null);

    const { data, error } = await supabase
      .from("quote_requests")
      .select(
        "id, created_at, name, organization, whatsapp, email, package, students, city, deadline, details, price_min, price_max, eta_min_days, eta_max_days, status, notes"
      )
      .order("created_at", { ascending: false });

    if (error) return setErrMsg(error.message);
    setQuotes((data ?? []) as any);
  }

  async function loadTestimonials() {
    setErrMsg(null);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return setErrMsg(error.message);
    setTestimonials((data ?? []) as any);
  }

  async function loadAnalytics() {
    setErrMsg(null);
    const { data, error } = await supabase
      .from("analytics_events")
      .select("id, created_at, event, path, referrer, session_id, meta")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) return setErrMsg(error.message);
    setAnalytics((data ?? []) as any);
  }

  async function updateInquiry(id: string, patch: Partial<Inquiry>) {
    setSavingId(id);
    setErrMsg(null);

    const { error } = await supabase.from("inquiries").update(patch).eq("id", id);

    if (error) setErrMsg(error.message);
    setSavingId(null);
    await loadInquiries();
  }

  async function updateQuote(id: string, patch: Partial<QuoteRequest>) {
    setSavingId(id);
    setErrMsg(null);

    const { error } = await supabase.from("quote_requests").update(patch).eq("id", id);

    if (error) setErrMsg(error.message);
    setSavingId(null);
    await loadQuotes();
  }

  async function updateTestimonial(id: string, patch: Partial<TestimonialRow>) {
    setSavingId(id);
    setErrMsg(null);

    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);

    if (error) setErrMsg(error.message);
    setSavingId(null);
    await loadTestimonials();
  }

  useEffect(() => {
    (async () => {
      const g = await ensureAdminAndMaybeLoad(true);
      if (!g.ok) return;
      await loadInquiries();
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    (async () => {
      if (tab === "inquiries" && inquiries.length === 0) await loadInquiries();
      if (tab === "quotes" && quotes.length === 0) await loadQuotes();
      if (tab === "testimonials" && testimonials.length === 0) await loadTestimonials();
      if (tab === "analytics" && analytics.length === 0) await loadAnalytics();
    })();
  }, [tab, isAdmin]);

  const analyticsSummary = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of analytics) c[r.event] = (c[r.event] || 0) + 1;
    return c;
  }, [analytics]);

  if (loading) return <div className="p-6">Loading admin...</div>;

  return (
    <div className="p-6 space-y-4">
      {/* header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Login sebagai: {me?.email || me?.id}</p>
        </div>

        <button onClick={onLogout} className="rounded-xl border px-4 py-2">
          Logout
        </button>
      </div>

      {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}

      {!isAdmin ? (
        <div className="rounded-xl border p-4">
          <p className="font-semibold">Unauthorized</p>
          <p className="text-sm text-gray-600">
            Tambahin user_id kamu ke tabel <code>public.admins</code>.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <TabBtn active={tab === "inquiries"} onClick={() => setTab("inquiries")}>
              Inquiries
            </TabBtn>
            <TabBtn active={tab === "quotes"} onClick={() => setTab("quotes")}>
              Quotation
            </TabBtn>
            <TabBtn active={tab === "testimonials"} onClick={() => setTab("testimonials")}>
              Testimonials
            </TabBtn>
            <TabBtn active={tab === "analytics"} onClick={() => setTab("analytics")}>
              Analytics
            </TabBtn>

            <div className="ml-auto">
              <button
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                onClick={async () => {
                  const g = await ensureAdminAndMaybeLoad(false);
                  if (!g.ok) return;

                  if (tab === "inquiries") await loadInquiries();
                  if (tab === "quotes") await loadQuotes();
                  if (tab === "testimonials") await loadTestimonials();
                  if (tab === "analytics") await loadAnalytics();
                }}
              >
                Refresh Tab
              </button>
            </div>
          </div>

          {tab === "inquiries" && (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Tanggal</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">WA</th>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Pesan</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Notes</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((it) => (
                    <InquiryRow
                      key={it.id}
                      item={it}
                      saving={savingId === it.id}
                      onSave={(patch) => updateInquiry(it.id, patch)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "quotes" && (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Tanggal</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Paket</th>
                    <th className="p-3 text-left">Siswa</th>
                    <th className="p-3 text-left">Kota</th>
                    <th className="p-3 text-left">Deadline</th>
                    <th className="p-3 text-left">Estimasi</th>
                    <th className="p-3 text-left">Detail</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Notes</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <QuoteRow
                      key={q.id}
                      item={q}
                      saving={savingId === q.id}
                      onSave={(patch) => updateQuote(q.id, patch)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "testimonials" && (
            <div className="space-y-3">
              {testimonials.map((r) => (
                <div key={r.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {r.name} {r.organization ? `— ${r.organization}` : ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleString("id-ID")} • Rating: {r.rating}/5
                      </div>
                      <p className="mt-2 whitespace-pre-wrap">{r.message}</p>
                    </div>

                    <div className="w-[240px] space-y-2">
                      <select
                        className="w-full rounded-xl border p-2"
                        value={r.status}
                        onChange={(e) => {
                          const status = e.target.value as TestimonialRow["status"];
                          setTestimonials((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, status } : x))
                          );
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>

                      <textarea
                        className="w-full rounded-xl border p-2"
                        rows={3}
                        placeholder="Admin notes (opsional)"
                        value={r.notes ?? ""}
                        onChange={(e) => {
                          const notes = e.target.value;
                          setTestimonials((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, notes } : x))
                          );
                        }}
                      />

                      <button
                        onClick={() => updateTestimonial(r.id, { status: r.status, notes: r.notes })}
                        disabled={savingId === r.id}
                        className="w-full rounded-xl bg-black px-3 py-2 font-semibold text-white disabled:opacity-60"
                      >
                        {savingId === r.id ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "analytics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Object.entries(analyticsSummary).map(([k, v]) => (
                  <div key={k} className="rounded-2xl border bg-white p-4">
                    <div className="text-sm text-gray-500">{k}</div>
                    <div className="text-2xl font-black">{v}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {analytics.map((r) => (
                  <div key={r.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold">{r.event}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      <b>{r.path}</b> {r.referrer ? `• ref: ${r.referrer}` : ""}
                    </div>
                    {r.meta && (
                      <pre className="mt-2 overflow-auto rounded-xl bg-gray-50 p-2 text-xs">
                        {JSON.stringify(r.meta, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2 text-sm font-semibold",
        active ? "bg-black text-white border-black" : "bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function InquiryRow({
  item,
  saving,
  onSave,
}: {
  item: Inquiry;
  saving: boolean;
  onSave: (patch: Partial<Inquiry>) => void;
}) {
  const [status, setStatus] = useState<Inquiry["status"]>(item.status);
  const [notes, setNotes] = useState(item.notes ?? "");

  useEffect(() => {
    setStatus(item.status);
    setNotes(item.notes ?? "");
  }, [item.id, item.status, item.notes]);

  return (
    <tr className="border-t align-top">
      <td className="p-3 whitespace-nowrap">{new Date(item.created_at).toLocaleString("id-ID")}</td>
      <td className="p-3">
        <div className="font-semibold">{item.name}</div>
        <div className="text-gray-600">{item.organization}</div>
        <div className="text-gray-600">{item.email}</div>
      </td>
      <td className="p-3">{item.whatsapp}</td>
      <td className="p-3">{item.service}</td>
      <td className="p-3 max-w-[280px]">
        <div className="whitespace-pre-wrap">{item.message}</div>
      </td>
      <td className="p-3">
        <select
          className="rounded-lg border p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
          <option value="spam">spam</option>
        </select>
      </td>
      <td className="p-3">
        <textarea
          className="w-[240px] rounded-lg border p-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </td>
      <td className="p-3">
        <button
          className="rounded-lg bg-black px-3 py-2 text-white disabled:opacity-60"
          disabled={saving}
          onClick={() => onSave({ status, notes })}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </td>
    </tr>
  );
}

function QuoteRow({
  item,
  saving,
  onSave,
}: {
  item: QuoteRequest;
  saving: boolean;
  onSave: (patch: Partial<QuoteRequest>) => void;
}) {
  const [status, setStatus] = useState<string>(item.status ?? "new");
  const [notes, setNotes] = useState(item.notes ?? "");

  useEffect(() => {
    setStatus(item.status ?? "new");
    setNotes(item.notes ?? "");
  }, [item.id, item.status, item.notes]);

  const priceText =
    item.price_min != null && item.price_max != null
      ? `Rp ${item.price_min.toLocaleString("id-ID")} - Rp ${item.price_max.toLocaleString("id-ID")}`
      : "-";

  const etaText =
    item.eta_min_days != null && item.eta_max_days != null
      ? `${item.eta_min_days}-${item.eta_max_days} hari`
      : "-";

  return (
    <tr className="border-t align-top">
      <td className="p-3 whitespace-nowrap">{new Date(item.created_at).toLocaleString("id-ID")}</td>
      <td className="p-3">
        <div className="font-semibold">{item.name}</div>
        <div className="text-gray-600">{item.organization}</div>
        <div className="text-gray-600">{item.whatsapp}</div>
        <div className="text-gray-600">{item.email}</div>
      </td>
      <td className="p-3">{item.package}</td>
      <td className="p-3">{item.students}</td>
      <td className="p-3">{item.city}</td>
      <td className="p-3 whitespace-nowrap">{item.deadline}</td>
      <td className="p-3">
        <div>{priceText}</div>
        <div className="text-gray-600">{etaText}</div>
      </td>
      <td className="p-3 max-w-[280px]">
        <div className="whitespace-pre-wrap text-gray-700">{item.details || "-"}</div>
      </td>
      <td className="p-3">
        <select
          className="rounded-lg border p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
          <option value="spam">spam</option>
        </select>
      </td>
      <td className="p-3">
        <textarea
          className="w-[240px] rounded-lg border p-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="notes (opsional)"
        />
      </td>
      <td className="p-3">
        <button
          className="rounded-lg bg-black px-3 py-2 text-white disabled:opacity-60"
          disabled={saving}
          onClick={() => onSave({ status, notes })}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </td>
    </tr>
  );
}
