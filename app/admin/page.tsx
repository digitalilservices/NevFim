import { redirect } from "next/navigation";

import { AdminOrdersClient } from "@/components/Admin/AdminOrdersClient";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "illypanferov15@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/account");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        first_name,
        last_name,
        phone,
        email,
        country,
        city,
        address,
        comment,
        total_price,
        created_at,
        closed_at,
        admin_hidden,
        order_items (
          id,
          source,
          category_name,
          product_code,
          model_name,
          image_url,
          width_mm,
          height_mm,
          depth_mm,
          material,
          color,
          fabric,
          customer_prompt,
          price,
          quantity
        )
      `,
    )
    .eq("admin_hidden", false)
    .order("created_at", { ascending: false });

  return (
    <AdminOrdersClient
      initialOrders={orders ?? []}
      initialError={error?.message ?? ""}
    />
  );
}
