"use client";

import React, { useRef } from "react";
import SideMenu from "@/components/side-menu";
import { categoryQueryOptions } from "@/context/category-query";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
// 📘 Best for animations based on Refs
import gsap from "gsap";

function Navbar() {
  const { queryFn, queryKey } = categoryQueryOptions();
  const { data } = useQuery(queryKey, () => queryFn());
  const underlineRef = useRef<HTMLSpanElement>(null);
  const underLinePosition = (width: number, x: number) => {
    gsap.to(underlineRef.current, {
      width: width,
      x: x,
      duration: 0.3,
      opacity: 1,
      ease: "power2.inOut",
    });
  };
  const hideUnderline = () => {
    gsap.to(underlineRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  return (
    <nav
      className='flex justify-end items-center gap-3 w-[48px] md:w-full'
      onMouseLeave={hideUnderline}>
      <ul className='hidden relative md:flex justify-center items-center gap-6 font-black text-xl rtl'>
        {data?.data?.categories?.map((category) => (
          <li
            key={`category-id-${category.id}`}
            className='active:scale-90 ease-in-ou cursor-pointer'
            onMouseEnter={(e) =>
              underLinePosition(
                e.currentTarget.offsetWidth,
                e.currentTarget.offsetLeft,
              )
            }>
            <Link href={`/${category.link!}`}>{category.name}</Link>
          </li>
        ))}
        <span
          ref={underlineRef}
          className='bottom-0 left-0 z-[-1] absolute bg-blue-600 dark:bg-blue-300 opacity-0 p-[1px]'></span>
      </ul>
      <SideMenu />
    </nav>
  );
}

export default Navbar;
