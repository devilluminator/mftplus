"use client";
import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/context/product-query";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Search, LucideInfo } from "lucide-react";
import AddProduct from "@/components/product/add-product";
import Image from "next/image";
import { formattedDate } from "@/lib/format-date";
import EditProduct from "@/components/product/edit-product";
import { colorsPallet } from "@/lib/hex-colors";
import DeleteProduct from "@/components/product/delete-product";
import ShowMoreInfo from "./more-info";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function ProductsPage() {
  const { queryFn, queryKey } = productsQueryOptions();
  const { data, refetch, isRefetching } = useQuery(queryKey, () => queryFn());
  // State
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined,
  );
  // Refs
  const searchInput = useRef<HTMLInputElement>(null);
  // Functions
  const searchProducts = () => {
    const value = searchInput.current?.value;
    if (value) {
      setCurrentValue(value);
    }
    if (!value || value.trim().length === 0) {
      setCurrentValue(undefined);
    }
  };
  return (
    <div className='flex flex-col justify-start items-end w-full'>
      <div className='my-3'>
        <span className='relative flex justify-end items-center gap-3'>
          <AddProduct refetch={refetch} />
          <Input
            ref={searchInput}
            placeholder='(کد-محصول) جستجو '
            className='backdrop-blur-sm pr-9 min-w-[240px] md:min-w-[270px] text-right'
            type='search'
            onKeyUp={() => searchProducts()}
          />
          <Search className='right-1 absolute' />
        </span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='link'
            className='text-emerald-600 dark:text-emerald-300'>
            یه کوچولو توضیح <LucideInfo />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='text-sm text-pretty rtl'>
          <p>
            برای حفظ aspect-ratio تصویر محصول بهتره روی ¾ سایز رو نگه داریم مثال
            512 در 768
          </p>
          <p>فرمت عکس webp باشه خیلی بهتره هم حجم کمی داره هم سرعت لود بالا</p>
        </PopoverContent>
      </Popover>

      <Table className='backdrop-blur-sm rtl'>
        <TableCaption className='min-h-[60px]'>
          لیست کالاهای موجود - {data?.data?.products.length}
          <Spinner
            show={isRefetching}
            className='text-emerald-600 dark:text-emerald-300'
          />
        </TableCaption>
        <TableHeader>
          <TableRow className='[&>th]:text-right'>
            <TableHead className='w-[30px]'>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className='hidden md:table-cell'>Description</TableHead>
            <TableHead className='hidden md:table-cell'>Price</TableHead>
            <TableHead className='hidden md:table-cell'>Off</TableHead>
            <TableHead className='hidden md:table-cell'>Special-Sale</TableHead>
            <TableHead className='hidden md:table-cell'>Category</TableHead>
            <TableHead className='hidden md:table-cell'>Colors</TableHead>
            <TableHead className='hidden md:table-cell'>Brand</TableHead>
            <TableHead className='hidden md:table-cell'>Gender</TableHead>
            <TableHead className='hidden md:table-cell'>Size</TableHead>
            <TableHead className='hidden md:table-cell'>Material</TableHead>
            <TableHead className='hidden md:table-cell'>CreatedAt</TableHead>
            <TableHead className='hidden md:table-cell'>UpdatedAt</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.products
            .filter((item) => item.code?.includes(currentValue || ""))
            .map((product, index) => (
              <TableRow
                key={`product-id-${product.id}`}
                className='[&>td]:overflow-hidden [&>td]:text-ellipsis [&>td]: whitespace-nowrap [&>td]:max-w-[60px]'>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Image
                    priority={index === 1}
                    src={product.og_image!}
                    alt='product og_image'
                    width={60}
                    height={90}
                    className='rounded-sm w-auto h-auto'
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.description}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.price}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.off}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.special_off === 1 ? "بله" : "خیر"}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.category}
                </TableCell>
                <TableCell className='hidden md:flex justify-center items-center gap-1 h-[9vh]'>
                  {colorsPallet(product.colors!).map((color, index) => (
                    <span
                      key={`product-list-id-${index}`}
                      className='p-3 border rounded-full w-3 h-3'
                      style={{ backgroundColor: color }}></span>
                  ))}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.brand}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {!product.gender || product.gender?.length === 0
                    ? "X"
                    : product.gender}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {!product.size || product.size.length === 0
                    ? "X"
                    : product.size}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {!product.material || product.material.length === 0
                    ? "X"
                    : product.material}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {formattedDate(product.created_at!)}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.updated_at ? formattedDate(product.updated_at) : "X"}
                </TableCell>
                <TableCell className='opacity-75 hover:opacity-100 cursor-pointer'>
                  <EditProduct product={product} refetch={refetch} />
                </TableCell>
                <TableCell className='opacity-75 hover:opacity-100 text-destructive cursor-pointer'>
                  <DeleteProduct
                    id={product.id}
                    name={product.name}
                    refetch={refetch}
                  />
                </TableCell>
                <TableCell className='opacity-75 hover:opacity-100 cursor-pointer'>
                  <ShowMoreInfo product={product} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductsPage;
