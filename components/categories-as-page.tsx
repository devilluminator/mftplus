"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryQueryOptions } from "@/context/category-query";
import Link from "next/link";

function CategoriesAsPage() {
  const { queryKey, queryFn } = categoryQueryOptions();
  const { data } = useQuery([queryKey, "products"], () => queryFn());

  return (
    <span className='md:hidden flex flex-col justify-start items-center font-semibold'>
      {data?.data?.categories.map((category) => (
        <Link
          href={`/${category.link}`}
          key={category.id}
          className='flex justify-end items-center gap-3 hover:bg-secondary p-3 border-b rounded-md w-full transition-colors'>
          <span>{category.name}</span>
        </Link>
      ))}
    </span>
  );
}

export default CategoriesAsPage;
