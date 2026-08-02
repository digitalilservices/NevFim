export type FurnitureCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultPrice: number;
  defaultDays: string;
};

export type FurnitureCharacteristic = {
  label: string;
  value: string;
};

export type FurnitureModel = {
  id: string;
  productCode: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;

  /**
   * Optional product page data.
   * You can add these fields only to the products that need custom content.
   * If a field is omitted, the product page uses a safe category default.
   */
  images?: string[];
  fullDescription?: string;
  characteristics?: FurnitureCharacteristic[];
  dimensions?: {
    widthMm?: number;
    heightMm?: number;
    depthMm?: number;
  };
  materials?: string[];
  colors?: string[];
  fabrics?: string[];
  inStock?: boolean;
  isBestSeller?: boolean;
  recommendedIds?: string[];
};
