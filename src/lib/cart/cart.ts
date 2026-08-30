import { createClient } from "@/lib/supabase/client";

export type AddToCartInput = {
  source: "2d" | "catalog";
  categoryId?: string;
  categoryName?: string;
  modelId: string;
  productCode: string;
  modelName: string;
  imageUrl?: string;
  widthMm?: number | null;
  heightMm?: number | null;
  depthMm?: number | null;
  material?: string;
  color?: string;
  fabric?: string;
  customerPrompt?: string;
  price: number;
  quantity?: number;
};

export async function addToCart(input: AddToCartInput) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      requiresAuth: true,
      error: "AUTH_REQUIRED",
    } as const;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      source: input.source,
      category_id: input.categoryId ?? null,
      category_name: input.categoryName ?? null,
      model_id: input.modelId,
      product_code: input.productCode,
      model_name: input.modelName,
      image_url: input.imageUrl ?? null,
      width_mm: input.widthMm ?? null,
      height_mm: input.heightMm ?? null,
      depth_mm: input.depthMm ?? null,
      material: input.material || null,
      color: input.color || null,
      fabric: input.fabric || null,
      customer_prompt: input.customerPrompt || null,
      price: input.price,
      quantity: input.quantity ?? 1,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      requiresAuth: false,
      error: error.message,
    } as const;
  }

  return {
    success: true,
    requiresAuth: false,
    item: data,
  } as const;
}
