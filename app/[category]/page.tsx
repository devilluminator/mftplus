// ⭐ Our Dynamic Routes - Pathname for getting specific [category] products info from DB
import React, { use } from "react";
import { db } from "@/server/db";
import { BlurFade } from "@/components/magicui/blur-fade";
import { searchParamsCache } from "@/lib/search-params";
import { type SearchParams } from "nuqs/server";
import Filter from "@/components/filter";
import ProductCard from "@/components/product/card";
import { removeCommas } from "@/lib/calculate-percentage";
import { desc } from "drizzle-orm";
import { products as productsTable } from "@/server/db/schema";
import type { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
};

// ✅ Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { category } = await params;

  // fetch data
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.category, category),
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.category,
    openGraph: {
      images: [product?.og_image!, ...previousImages],
    },
  };
}

function OurCategoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = use(params);
  let data = use(
    db.query.products.findMany({
      orderBy: [desc(productsTable.id)],
      where: (products, { eq }) => eq(products.category, category),
    }),
  );

  if (!data.length)
    return (
      <div className='flex justify-center items-center border rounded-md min-h-[72vh] size-full text-xl container'>
        <p className='shadow-md backdrop-blur-sm p-3 border rounded-md'>
          404 | This page could not be found.
        </p>
      </div>
    );
  const maxPrices = Math.max(
    ...data.map((product) => parseFloat(removeCommas(product.price!))),
  );
  const minPrices = Math.min(
    ...data.map((product) => parseFloat(removeCommas(product.price!))),
  );
  const colors = data.flatMap((obj) => [...new Set(obj.colors?.split(","))]);
  const brands = [...new Set(data.map((product) => product.brand))];
  const sizes = data.flatMap((obj) =>
    obj.size?.trim().length !== 0 ? [...new Set(obj.size?.split("-"))] : [],
  );
  const special_sale = data.flatMap((obj) => obj.special_off);
  use(searchParamsCache.parse(searchParams));
  const { color, size, brand, minPrice, maxPrice, specialSale } =
    searchParamsCache.all();
  // ✅ Checking if our searchParams have these options or not
  if (color) {
    data = data.filter((product) => product.colors?.includes(color));
  }
  if (size) {
    data = data.filter((product) => product.size?.includes(size.toLowerCase()));
  }
  if (minPrice) {
    data = data.filter(
      (product) => parseFloat(removeCommas(product.price!)) >= Number(minPrice),
    );
  }
  if (maxPrice) {
    data = data.filter(
      (product) => parseFloat(removeCommas(product.price!)) <= Number(maxPrice),
    );
  }
  if (brand) {
    data = data.filter((product) => product.brand?.includes(brand));
  }
  if (specialSale) {
    data = data.filter((product) => product.special_off === 1);
  }

  return (
    <div className='flex flex-col justify-start items-start p-3 border rounded-md container'>
      <Filter
        maxPrice={maxPrices}
        minPrice={minPrices}
        Colors={colors}
        brands={brands}
        sizes={sizes}
        special_sale={special_sale}
        products_length={data.length}
      />

      <div className='gap-3 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 rounded-md w-full rtl'>
        {data.map((item, idx) => (
          <BlurFade
            key={`show-product-info-${item.id}`}
            delay={0.25 + idx * 0.05}
            inView>
            <ProductCard product={item} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default OurCategoriesPage;
