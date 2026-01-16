import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PostSchema = z.object({
  name: z.string().min(2).max(80),
  organization: z.string().max(120).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(5).max(1000),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("id, created_at, name, organization, rating, message")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", detail: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const v = parsed.data;

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .insert([{
      name: v.name,
      organization: v.organization || null,
      rating: v.rating,
      message: v.message,
      status: "pending",
    }])
    .select("id")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data.id });
}
