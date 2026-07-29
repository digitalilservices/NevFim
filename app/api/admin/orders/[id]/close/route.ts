import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "illypanferov15@gmail.com";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { status } = (await request.json()) as {
    status?: "open" | "closed";
  };

  if (status !== "open" && status !== "closed") {
    return NextResponse.json(
      { error: "Неверный статус заявки." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json(
      { error: "Нет доступа." },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      closed_at: status === "closed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}


export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
  }

  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (readError || !order) {
    return NextResponse.json(
      { error: readError?.message || "Заказ не найден." },
      { status: 404 },
    );
  }

  if (order.status !== "closed") {
    return NextResponse.json(
      { error: "Убирать из админ-панели можно только закрытые заказы." },
      { status: 400 },
    );
  }

  // Заказ НЕ удаляется из базы. Он остаётся в истории клиента.
  const { error } = await supabase
    .from("orders")
    .update({ admin_hidden: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
