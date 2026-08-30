import type { FurnitureModel } from "@/types/furniture";

export const BED_BASE_WIDTH_MM = 1600;
export const BED_WIDTH_STEP_MM = 200;
export const BED_PRICE_STEP_CZK = 500;

/**
 * Beds use the model basePrice at the standard 1600 mm width.
 * Every 200 mm step changes the price by 500 Kč.
 * Other furniture categories keep their basePrice.
 */
export function calculateFurniturePrice(
  model: FurnitureModel | null | undefined,
  widthMm?: number | null,
) {
  if (!model) return 0;
  if (model.categoryId !== "beds") return model.basePrice;

  const width = Number(widthMm);
  if (!Number.isFinite(width) || width <= 0) return model.basePrice;

  const steps = Math.round((width - BED_BASE_WIDTH_MM) / BED_WIDTH_STEP_MM);
  return Math.max(0, model.basePrice + steps * BED_PRICE_STEP_CZK);
}
