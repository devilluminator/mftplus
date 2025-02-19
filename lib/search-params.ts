import {
  parseAsString,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
} from "nuqs/server";

export const searchParams = {
  category: parseAsArrayOf(parseAsString).withDefault([]),
  color: parseAsString.withDefault(""),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  size: parseAsString.withDefault(""),
  brand: parseAsString.withDefault(""),
  specialSale: parseAsInteger.withDefault(0),
  // id: parseAsInteger.withDefault(0),
};
export const searchParamsCache = createSearchParamsCache(searchParams);
