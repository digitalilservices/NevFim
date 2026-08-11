import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function adminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { supabase, authorized: false } as const;
  }

  return { supabase, authorized: true } as const;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, authorized } = await adminClient();

  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { status?: "open" | "closed" };
  if (body.status !== "open" && body.status !== "closed") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({
      status: body.status,
      closed_at: body.status === "closed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, authorized } = await adminClient();

  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: message, error: readError } = await supabase
    .from("contact_messages")
    .select("status")
    .eq("id", id)
    .single();

  if (readError || !message) {
    return NextResponse.json(
      { error: readError?.message || "Message not found" },
      { status: 404 },
    );
  }

  if (message.status !== "closed") {
    return NextResponse.json(
      { error: "Only closed messages can be deleted." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
