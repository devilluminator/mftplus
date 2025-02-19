import { getCategories, getCategory } from "@/server/actions/categories";
export const categoryQueryOptions = () => ({
  queryKey: ["category"],
  queryFn: getCategories,
});

export const categoryQueryOptionsByLink = (link: string) => ({
  queryKey: ["category", link],
  queryFn: getCategory,
});
