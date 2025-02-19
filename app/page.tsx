import React, { use } from "react";
import HeroSection from "@/components/hero-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/server/db";
import Image from "next/image";
import { PercentIcon } from "lucide-react";

import Link from "next/link";
import { removeCommas } from "@/lib/calculate-percentage";
import { MarqueeDemo } from "@/components/marquee-demo";
export default function HomePage() {
  const products = use(
    db.query.products.findMany({
      orderBy: (products, { desc }) => desc(products.id),
    }),
  );

  return (
    <main className='flex flex-col justify-start items-start gap-6 border rounded-md size-full overflow-hidden container'>
      <HeroSection />
      <h1 className='flex justify-end items-center px-3 w-full font-semibold text-xl text-right'>
        {" "}
        <PercentIcon strokeWidth={3} />
        شگفــت فرنگـیـزا
      </h1>
      <Carousel
        className='relative w-full'
        opts={{
          startIndex: products.length - 1,
        }}>
        <CarouselContent>
          {products.map(
            (product, index) =>
              product.special_off === 1 && (
                <CarouselItem
                  key={product.id}
                  className='relative flex flex-col justify-center items-center backdrop-blur-sm mb-6 ml-3 pr-3 border rounded-md basis-[45%] md:basis-[18%] xl:basis-[12%]'>
                  <Link
                    href={`/product/${product.code}/${product.name}`}
                    className='w-full h-full'>
                    <Image
                      priority={index === 0 ? true : false}
                      src={product.og_image!}
                      width={200}
                      height={210}
                      alt={product.name!}
                      className='border-b rounded-md w-full h-full'
                    />
                  </Link>
                  <div className='flex flex-col justify-center items-center w-full rtl'>
                    <p className='opacity-75 px-3 pt-3 w-full font-light text-xs ellipsis-2 rtl'>
                      {product.title}
                    </p>
                    <div className='flex justify-center items-center gap-1 font-[family-name:var(--font-numbers)] rtl'>
                      {product.off && Number(product.off) > 0 && (
                        <p className='top-0 right-0 absolute bg-rose-600 p-1 rounded-md text-slate-50 text-sm'>
                          {product.off}%
                        </p>
                      )}
                      <p
                        className={`flex justify-center items-center gap-1 w-full ${
                          product.off && Number(product.off) > 0
                            ? "line-through"
                            : "underline"
                        }`}>
                        {Number(removeCommas(product.price!)).toLocaleString(
                          "en-US",
                        )}
                        <span>تومان</span>
                      </p>
                    </div>
                    {product.off && Number(product.off) > 0 && (
                      <p className='flex justify-center items-center gap-1 w-full font-[family-name:var(--font-numbers)] text-rose-600 text-lg'>
                        {(
                          Number(removeCommas(product.price!)) -
                          (Number(removeCommas(product.price!)) *
                            Number(product.off)) /
                            100
                        ).toLocaleString("en-US")}
                        <span>تومان</span>
                      </p>
                    )}
                  </div>
                </CarouselItem>
              ),
          )}
        </CarouselContent>
        <CarouselPrevious className='left-[18px] absolute opacity-45 hover:opacity-100 -mt-9 scale-150' />
        <CarouselNext className='right-[18px] absolute opacity-45 hover:opacity-100 -mt-9 scale-150' />
      </Carousel>
      <MarqueeDemo products={products} />
    </main>
  );
}
// font-[family-name:var(--font-numbers)]
