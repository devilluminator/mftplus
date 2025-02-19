export type Product = {
  id?: number;
  gender?: string | null;
  size?: string | null;
  updated_at?: string | null;
  name: string | null;
  description: string | null;
  price: string | null;
  code: string | null;
  off: string | null;
  special_off: number | null;
  og_image: string | null;
  category: string | null;
  colors: string | null;
  material: string | null;
  brand: string | null;
  created_at: string | null;
  title: string | null;
}[];

export type ProductsProps =
  | {
      id: number;
      name: string | null;
      created_at: string | null;
      updated_at: string | null;
      deleted_at: string | null;
      title: string | null;
      description: string | null;
      price: string | null;
      code: string | null;
      off: string | null;
      special_off: string | boolean | null;
      og_image: string | null;
      category: string | null;
      colors: string | null;
      size: string | null;
      brand: string | null;
      gender: string | null;
      material: string | null;
    }[]
  | undefined;
