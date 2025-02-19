"use client";
import React, { useState } from "react";
import { Product } from "@/types/products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TableOfContentsIcon } from "lucide-react";
import Image from "next/image";
import { colorsPallet } from "@/lib/hex-colors";
import { formattedDate } from "@/lib/format-date";
import { delay } from "@/lib/delay";
import { Spinner } from "@/components/ui/spinner";
import { ShineBorder } from "@/components/magicui/shine-border";
import { calculatePercentage } from "@/lib/calculate-percentage";
import { useTheme } from "next-themes";

function ShowMoreInfo({ product }: { product: Product[0] }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <Dialog>
      <DialogTrigger>
        <TableOfContentsIcon />
      </DialogTrigger>
      <DialogContent className='m-0 p-0 rounded-md max-w-[360px] md:max-w-[45%] rtl'>
        <ShineBorder
          borderWidth={3}
          color={theme === "dark" ? "white" : "black"}
          className='w-full'>
          <DialogHeader>
            <DialogTitle className='flex justify-center items-center gap-1 py-3'>
              {product.name}
              <Spinner
                show={isLoading}
                className='text-emerald-600 dark:text-emerald-300'
              />
            </DialogTitle>
            <DialogDescription className='relative flex md:flex-row flex-col justify-start items-start gap-3'>
              {isLoading && (
                <Skeleton className='right-0 z-[3] absolute rounded-md w-[270px] h-[360px]' />
              )}
              <Image
                onLoad={async () => {
                  await delay(3000);
                  setIsLoading(false);
                }}
                src={product.og_image!}
                alt='product info og_image w-[20%]'
                width={270}
                height={360}
                className={`border rounded-md w-auto h-auto transition-opacity ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`flex flex-col justify-start items-start gap-1 md:gap-3 text-right text-pretty [&>span]:font-bold ${
                  isLoading ? "opacity-0" : "opacity-100"
                } `}>
                <span>قیمت : {product.price} تومان</span>
                <span>کد محصول : {product.code}</span>
                <span>
                  تخفیف : {product.off}% -{" "}
                  {Number(product.off) > 0 &&
                    calculatePercentage(product.price!, product.off!) +
                      "تومان"}{" "}
                </span>
                <span className='font-bold'>
                  فروش ویژه : {product.special_off === 1 ? "بله" : "خیر"}
                </span>
                <span>دسته بندی : {product.category}</span>
                <span className='flex justify-center items-center gap-1 font-bold'>
                  رنگ ها :{" "}
                  {colorsPallet(product.colors!).map((color, index) => (
                    <span
                      key={`product-more-info-id${index}`}
                      className='p-3 border rounded-full w-3 h-3'
                      style={{ backgroundColor: color }}></span>
                  ))}
                </span>
                <span>برند : {product.brand}</span>
                <span>
                  جنسیت :{" "}
                  {product.gender?.length === 0 ? "ندارد" : product.gender}
                </span>
                <span>
                  سایز : {product.size?.length === 0 ? "ندارد" : product.size}
                </span>
                <span>متریال : {product.material}</span>
                <span>تاریخ ایجاد : {formattedDate(product.created_at!)}</span>
                <span>
                  تاریخ بروزرسانی :{" "}
                  {product.updated_at
                    ? formattedDate(product.updated_at)
                    : "---"}
                </span>
                <span>توضیحات : {product.description}</span>
              </span>
            </DialogDescription>
          </DialogHeader>
        </ShineBorder>
      </DialogContent>
    </Dialog>
  );
}

export default ShowMoreInfo;
