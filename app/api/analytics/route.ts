import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const Schema = z.object({
  event: z.enum([
    "view_page",
    "click_whatsapp",
    "click_view_portfolio",
    "submit_inquiry",
    "submit_quote",
    "submit_testimonial",
  ]),
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional().nullable(),
  session_id: z.string().uuid().optional().nullable(),
  meta: z.any().optional().nullable(),
});

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const v = parsed.data;

    const ua = req.headers.get("user-agent") || null;
    const xf = req.headers.get("x-forwarded-for") || "";
    const ip = xf.split(",")[0]?.trim() || "";
    const ipHash = ip ? hashIp(ip) : null;

    const { error } = await supabaseAdmin.from("analytics_events").insert([
      {
        event: v.event,
        path: v.path,
        referrer: v.referrer || null,
        session_id: v.session_id || null,
        meta: v.meta ?? null,
        user_agent: ua,
        ip_hash: ipHash,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
