import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { Language } from "@/i18n/translations";

type ContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string;
  language?: Language;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let body: ContactRequest;

  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots receive a harmless success response.
  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 3000);
  const language: Language =
    body.language === "cs" || body.language === "en" ? body.language : "ru";

  if (
    name.length < 2 ||
    !emailPattern.test(email) ||
    phone.length < 6 ||
    message.length < 10
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields correctly." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    user_id: user?.id ?? null,
    status: "open",
    name,
    email,
    phone,
    message,
    language,
  });

  if (error) {
    console.error("NevFim contact insert failed:", error.message);
    return NextResponse.json(
      { error: "The message could not be saved." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
