import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type OrderRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  country?: string;
  city?: string;
  address?: string;
  comment?: string;
};

function createOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  return `NF-${timestamp}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as OrderRequest;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Необходимо войти в аккаунт." },
      { status: 401 },
    );
  }

  const requiredValues = [
    body.firstName,
    body.lastName,
    body.phone,
    body.email,
    body.country,
    body.city,
    body.address,
  ];

  if (requiredValues.some((value) => !value?.trim())) {
    return NextResponse.json(
      { error: "Заполните все обязательные поля." },
      { status: 400 },
    );
  }

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id);

  if (cartError) {
    return NextResponse.json({ error: cartError.message }, { status: 400 });
  }

  if (!cartItems?.length) {
    return NextResponse.json(
      { error: "Корзина пустая." },
      { status: 400 },
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const orderNumber = createOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      status: "open",
      first_name: body.firstName!.trim(),
      last_name: body.lastName!.trim(),
      phone: body.phone!.trim(),
      email: body.email!.trim(),
      country: body.country!.trim(),
      city: body.city!.trim(),
      address: body.address!.trim(),
      comment: body.comment?.trim() || null,
      total_price: total,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "Не удалось создать заказ." },
      { status: 400 },
    );
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    source: item.source,
    category_id: item.category_id,
    category_name: item.category_name,
    model_id: item.model_id,
    product_code: item.product_code,
    model_name: item.model_name,
    image_url: item.image_url,
    width_mm: item.width_mm,
    height_mm: item.height_mm,
    depth_mm: item.depth_mm,
    material: item.material,
    color: item.color,
    fabric: item.fabric,
    customer_prompt: item.customer_prompt,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (clearError) {
    return NextResponse.json(
      {
        error:
          "Заказ создан, но корзину не удалось очистить. Обновите страницу.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    orderNumber: order.order_number,
  });
}
