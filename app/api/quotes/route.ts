import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { estimateQuote, type PackageType } from "@/lib/pricing";

const Schema = z.object({
  name: z.string().min(2).max(80),
  organization: z.string().max(120).optional().or(z.literal("")),
  whatsapp: z.string().min(8).max(30),
  email: z.string().email().optional().or(z.literal("")),

  package: z.enum(["yearbook", "photo", "video"]),
  students: z.coerce.number().int().min(1),
  city: z.string().min(2).max(80),
  deadline: z.string().min(8), // "YYYY-MM-DD"

  details: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload", detail: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const v = parsed.data;

    const deadlineDate = new Date(`${v.deadline}T00:00:00`);
    if (Number.isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ ok: false, error: "Invalid deadline date" }, { status: 400 });
    }

    const estimate = estimateQuote({
      package: v.package as PackageType,
      students: v.students,
      city: v.city,
      deadline: deadlineDate,
    });

    const insertData = {
      name: v.name,
      organization: v.organization || null,
      whatsapp: v.whatsapp,
      email: v.email || null,

      package: v.package,
      students: v.students,
      city: v.city,
      deadline: v.deadline, 
      details: v.details || null,

      price_min: estimate.priceMin,
      price_max: estimate.priceMax,
      eta_min_days: estimate.etaMinDays,
      eta_max_days: estimate.etaMaxDays,

    };

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .insert([insertData])
      .select("id, price_min, price_max, eta_min_days, eta_max_days")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, quote: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
