"use client";
import React from "react";
import Globe from "./globe";
import { Particles } from "./magicui/particles";
import { useTheme } from "next-themes";
import { WordRotate } from "./magicui/word-rotate";
import { productsQueryOptions } from "@/context/product-query";
import { useQuery } from "@tanstack/react-query";
import { BoxReveal } from "./magicui/box-reveal";

function HeroSection() {
  const { theme } = useTheme();
  const { queryKey, queryFn } = productsQueryOptions();
  const { data, isFetching } = useQuery([queryKey, "products"], () =>
    queryFn(),
  );

  return (
    <section className='relative flex justify-center items-center backdrop-blur-sm pb-6 border-b w-full min-h-[300px] md:min-h-[450px]'>
      <Globe />
      <Particles
        className='z-0 absolute inset-0'
        quantity={120}
        ease={80}
        color={theme === "dark" ? "#ffffff" : "#000000"}
        refresh
      />
      {!isFetching && (
        <div className='z-20 flex flex-col justify-center items-center gap-0 text-shadow-xl mr-0 md:mr-24 max-w-[33rem] size-full overflow-hidden rtl'>
          <BoxReveal boxColor={"#339BFF"} duration={0.9} width='100%'>
            <span className='flex justify-center md:justify-start pr-0 md:pr-3 pb-3 w-full md:font-bold text-6xl md:text-7xl italic'>
              هــرچــی،
            </span>
          </BoxReveal>
          <p className='mt-6 pr-0 pb-1 md:font-bold text-6xl md:text-7xl text-center md:text-right'>
            از هر جای دنیا!
          </p>

          <BoxReveal boxColor={"#339BFF"} duration={0.6}>
            <WordRotate
              className='mt-9 rounded-md font-black text-[2.5rem] text-black md:text-[3.3rem] dark:text-white'
              words={
                data?.data?.products
                  .filter(
                    (product) => product.category === "electronic-devices",
                  )
                  .map((item) => item.name!) ?? []
              }
            />
          </BoxReveal>

          <BoxReveal boxColor={"#339BFF"} duration={0.3}>
            <div className='flex justify-center items-center gap-1 mt-6'>
              <p className='md:font-bold text-5xl md:text-6xl'>
                همــیــنجــاســت
              </p>
              <p className='opacity-75 text-base'>(به خدا)</p>
            </div>
          </BoxReveal>
        </div>
      )}
    </section>
  );
}

export default HeroSection;
