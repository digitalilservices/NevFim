export type FurnitureCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultPrice: number;
  defaultDays: string;
};

export type FurnitureModel = {
  id: string;
  productCode: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
};