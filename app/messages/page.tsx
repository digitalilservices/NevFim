import { redirect } from "next/navigation";

import { AdminMessagesClient } from "@/components/Admin/AdminMessagesClient";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "illypanferov15@gmail.com";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/account");
  }

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select(
      "id, status, name, email, phone, message, language, created_at, closed_at",
    )
    .order("created_at", { ascending: false });

  return (
    <AdminMessagesClient
      initialMessages={messages ?? []}
      initialError={error?.message ?? ""}
    />
  );
}
