"use client";
import React, { JSX, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/context/product-query";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "../ui/spinner";

type SearchProps = {
  className: string;
};
// functions
function Search(props: SearchProps): JSX.Element {
  const { queryKey, queryFn } = productsQueryOptions();
  const { data, isFetching } = useQuery(queryKey, () => queryFn());
  // States
  const [name, setName] = useState<string>("");
  // Refs
  const searchRef = useRef<HTMLInputElement>(null);
  const searchProducts_ = () => {
    if (searchRef.current?.value) {
      setName(searchRef.current.value);
    }
    if (searchRef.current?.value === "") {
      setName("");
    }
  };
  return (
    <div className='z-40 relative backdrop-blur-sm w-full'>
      <Input
        ref={searchRef}
        placeholder='جســتجـوی هرچی که بخوای! '
        className={cn("md:w-1/3 w-full min-h-[48px]", props.className)}
        onKeyUp={() => searchProducts_()}
      />
      <div className='top-[52px] absolute bg-background border rounded-md'>
        {data?.data?.products
          .filter(
            (product) =>
              name.length > 3 &&
              product.name?.toLowerCase()?.includes(name.toLowerCase()),
          )
          ?.map((product, index) => (
            <Link
              href={`/product/${product.code}/${product.name}`}
              key={index}
              onClick={() => setName("")}>
              <div className='flex flex-col justify-start items-center gap-3 hover:bg-secondary p-3 border-b rounded-md w-full transition-colors'>
                <Spinner
                  show={isFetching}
                  className='text-blue-600 dark:text-blue-300'
                />
                <span>{product.name}</span>
                <Image
                  src={product.og_image!}
                  alt={product.name!}
                  width={200}
                  height={300}
                  className='rounded-md w-auto max-w-[200px] h-auto max-h-[300px]'
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Search;
