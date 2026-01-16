export type AnalyticsEvent =
  | "view_page"
  | "click_whatsapp"
  | "click_view_portfolio"
  | "submit_inquiry"
  | "submit_quote"
  | "submit_testimonial";

export type AnalyticsMeta = Record<string, unknown>;

function uuidv4Fallback(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20)}`;
}

function getOrCreateSessionId(): string {
  const key = "hf_session_id";

  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const newId: string = (crypto as any).randomUUID?.() ?? uuidv4Fallback();
    window.localStorage.setItem(key, newId);
    return newId;
  } catch {
    return (crypto as any).randomUUID?.() ?? uuidv4Fallback();
  }
}


function safePath(): string {
  try {
    const p = window.location.pathname || "/";
    return p.length > 200 ? p.slice(0, 200) : p;
  } catch {
    return "/";
  }
}

function safeReferrer(): string | null {
  try {
    const r = document.referrer || "";
    if (!r) return null;
    return r.length > 500 ? r.slice(0, 500) : r;
  } catch {
    return null;
  }
}

export async function track(event: AnalyticsEvent, meta: AnalyticsMeta = {}) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      event,
      path: safePath(),
      referrer: safeReferrer(),
      session_id: getOrCreateSessionId(),
      meta: {
        ...meta,
        ts: new Date().toISOString(),
      },
    };

    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
  }
}
