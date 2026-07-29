import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Language } from "@/i18n/translations";

import { AccountCartClient } from "@/components/Account/AccountCartClient";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get("nevfim-language")?.value;
  const language: Language =
    savedLanguage === "cs" || savedLanguage === "en" ? savedLanguage : "ru";

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const [
    { data: cartItems, error: cartError },
    { data: orders, error: ordersError },
  ] = await Promise.all([
    supabase
      .from("cart_items")
      .select(
        "id, source, category_name, product_code, model_name, image_url, width_mm, height_mm, depth_mm, material, color, fabric, customer_prompt, price, quantity",
      )
      .order("created_at", { ascending: false }),
    supabase
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
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AccountCartClient
      email={user.email ?? "Пользователь"}
      initialItems={cartItems ?? []}
      initialOrders={orders ?? []}
      initialError={cartError?.message ?? ordersError?.message ?? ""}
      isAdmin={user.email === "illypanferov15@gmail.com"}
      language={language}
    />
  );
}
