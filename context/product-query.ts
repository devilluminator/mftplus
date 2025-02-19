import { getProducts, getProductByCategory } from "@/server/actions/products";

export const productsQueryOptions = () => ({
  queryKey: ["products"],
  queryFn: getProducts,
});

export const productsByCategoryQueryOptions = (category: string) => ({
  queryKey: ["products", category],
  queryFn: () => getProductByCategory({ category }),
});
