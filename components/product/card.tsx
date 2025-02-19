import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/products";
import Image from "next/image";
import { calculatePercentage } from "@/lib/calculate-percentage";
import { MagicCard } from "../magicui/magic-card";
import Link from "next/link";

function ProductCard({ product }: { product: Product[0] }) {
  return (
    <Card className='flex flex-col justify-center items-center shadow-lg border-none'>
      <Link href={`/product/${product.code}/${product.name}`}>
        <MagicCard className='min-h-[462px] cursor-pointer' gradientOpacity={0}>
          <CardHeader className='p-1'>
            <CardTitle className='pt-3 text-center'>{product.name}</CardTitle>
            <CardDescription className='px-3'>{product.code}</CardDescription>
          </CardHeader>
          <CardContent className='relative p-3 font-[family-name:var(--font-numbers)] text-center'>
            {Number(product.off) > 0 && (
              <span className='top-3 right-3 absolute bg-red-600 p-1 rounded-md text-white'>
                {product.off}%
              </span>
            )}
            <Image
              src={product.og_image!}
              alt={product.name!}
              width={270}
              height={300}
              className='mb-3 border rounded-md w-auto h-auto'
            />
            <p
              className={`${
                Number(product.off) > 0
                  ? "line-through"
                  : "underline min-h-[6vh] flex justify-center items-center flex-col-reverse text-lg"
              }`}>
              {product.price} تومان
            </p>
            {Number(product.off) > 0 && (
              <span className='text-red-600 dark:text-red-300 text-lg'>
                {calculatePercentage(product.price!, product.off!)} تومان
              </span>
            )}
          </CardContent>
          <CardFooter className='opacity-75 px-3'>
            <p className='pt-3 border-t w-full max-w-[330px] md:max-w-[180px] overflow-hidden text-sm text-ellipsis whitespace-nowrap'>
              {product.description}
            </p>
          </CardFooter>
        </MagicCard>
      </Link>
    </Card>
  );
}

export default ProductCard;
