"use server";
import React, { use } from "react";
import { db } from "@/server/db";
import ProductCard from "./product/card";
function SearchProducts({ name }: { name: string }) {
  const products = use(
    db.query.products.findMany({
      where: (products, { eq }) => eq(products.name, name),
    }),
  );
  return (
    <div>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}

export default SearchProducts;
