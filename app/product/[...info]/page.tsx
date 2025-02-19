import React from "react";
import { db } from "@/server/db";
import { removeCommas } from "@/lib/calculate-percentage";
import Image from "next/image";
import AddToCard from "@/components/add-to-card";
import { type SearchParams } from "nuqs/server";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { info: string };
  searchParams: SearchParams;
};

// ✅ Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { info } = params;

  // fetch data
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.code, info[0]),
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.name,
    openGraph: {
      images: [product?.og_image!, ...previousImages],
    },
  };
}
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  return products.slice(0, 3).map((product) => ({
    info: [product.code?.toString(), product.name?.toString()],
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ info: string }>;
}) {
  const { info } = await params;
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.code, info[0]),
  });

  return (
    <div className='relative flex md:flex-row flex-col-reverse justify-start items-center md:items-start gap-3 px-0 md:px-[1%] xl:px-[9%] w-full'>
      <div className='bottom-3 z-[27] md:relative sticky flex flex-col justify-start items-start bg-slate-50 dark:bg-slate-900 mt-3 p-3 border rounded-md w-[96%] md:w-auto'>
        <div className='flex flex-row-reverse justify-center items-center gap-1 w-full text-xl'>
          <div
            className={`font-bold font-[family-name:var(--font-numbers)] text-center flex justify-center items-center gap-1 flex-row-reverse ${
              Number(product?.off) > 0
                ? "line-through"
                : " text-3xl w-full underline"
            } `}>
            <span>
              {Number(removeCommas(product?.price!)).toLocaleString("en-US")}
            </span>
            <span>تومان</span>
          </div>
          <span
            className={`bg-red-600 p-1 rounded-md font-[family-name:var(--font-numbers)] text-white ${
              Number(product?.off) > 0 ? "flex" : "hidden"
            }`}>
            {product?.off}%
          </span>
        </div>
        {product?.off && Number(product?.off) > 0 && (
          <p className='flex justify-center items-center gap-1 w-full font-[family-name:var(--font-numbers)] text-3xl underline'>
            <span>تومان</span>
            {(
              Number(removeCommas(product?.price!)) -
              (Number(removeCommas(product?.price!)) * Number(product?.off)) /
                100
            ).toLocaleString("en-US")}
          </p>
        )}
        <AddToCard />
      </div>
      <div className='flex flex-col justify-start items-start gap-3 p-3 border rounded-md w-full h-full rtl'>
        <h1 className='text-xl md:text-3xl'>{product?.name}</h1>
        <span className='opacity-75 text-sm'>کد - {product?.code}</span>
        {/* colors */}
        {product?.colors && (
          <div className='flex flex-col justify-start items-start gap-1 rtl'>
            <span className='opacity-75'>رنگ بندی</span>
            <div className='flex justify-start items-start gap-1'>
              {product?.colors?.split(",").map((color, index) => (
                <div
                  key={`${index}_colors`}
                  className={`border-[3px] rounded-full w-6 h-6 cursor-pointer transition-all `}
                  style={
                    color.length > 3
                      ? { backgroundColor: color }
                      : { display: "none" }
                  }
                />
              ))}
            </div>
          </div>
        )}
        {/* sizes */}
        {product?.size && (
          <div className='flex flex-col justify-start items-start gap-1 rtl'>
            <span className='opacity-75'>سایز</span>
            <div className='flex justify-start items-start gap-1'>
              {product?.size?.split("-").map((size, index) => (
                <div
                  key={`${index}_sizes`}
                  className={`flex justify-center items-center hover:bg-slate-300 dark:bg-slate-600 p-3 border rounded-md w-9 h-9 uppercase cursor-pointer transition-all`}>
                  {size.toLowerCase() === "lg" ? "L" : size}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* material its only one */}
        {product?.material && (
          <div className='flex flex-row-reverse justify-start items-center gap-1'>
            <div className='flex flex-col justify-start items-start gap-1'>
              <span className='opacity-75'>جنس</span>
              <span>{product?.material}</span>
            </div>
          </div>
        )}
        {/* brand */}

        {product?.brand && (
          <div className='flex flex-row-reverse justify-start items-center gap-1'>
            <div className='flex flex-col justify-start items-start gap-1'>
              <span className='opacity-75'>برند</span>
              <span>{product?.brand}</span>
            </div>
          </div>
        )}

        {/* description with split \n if there any */}
        {product?.description && (
          <div className='flex flex-col justify-start items-start gap-1 pt-3 border-t w-full'>
            <span className='opacity-75'>توضیحات</span>
            {product?.description?.split("\n").map((item, index) => (
              <span className='uppercase' key={`${index}_description`}>
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
      <Image
        priority={true}
        src={product?.og_image!}
        alt={product?.name!}
        width={300}
        height={512}
        className='rounded-md w-auto h-auto'
      />
    </div>
  );
}
