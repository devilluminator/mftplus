import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Product } from "@/types/products";
import Image from "next/image";
import Link from "next/link";
import { removeCommas } from "@/lib/calculate-percentage";

const reviews = [
  {
    name: "ممد آقا",
    username: "@ممل",
    body: "اسم هرچی خیلی (...) زیباست",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "فتانه",
    username: "@فتی",
    body: "بیست و پنج ساله مشهد فقط دایرکت",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "جواد",
    username: "@jj",
    body: "آقا هرچی دروغه هیچی ندارن جاک...",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "سلطانعلی",
    username: "@soltoon",
    body: "از هرجای دنیا، از اونجای دنیا هم دارین؟",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "زری جون",
    username: "@goldy-joon",
    body: "گوشی که واسم فرستادن گوشش کجه! چرا رسیدگی نمیشه؟",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "فاطی کاماندو",
    username: "@fatti(Ein)",
    body: "صلی علی سترکه چشما ترامپ بترکه",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-md border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}>
      <div className='flex flex-row items-center gap-2'>
        <img className='rounded-full' width='32' height='32' alt='' src={img} />
        <div className='flex flex-col'>
          <figcaption className='font-medium dark:text-white text-sm'>
            {name}
          </figcaption>
          <p className='font-medium dark:text-white/40 text-xs'>{username}</p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm'>{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo({ products }: { products: Product }) {
  return (
    <div className='relative flex flex-col justify-center items-center bg-background md:shadow-xl mx-3 rounded-none w-full h-[630px] overflow-hidden'>
      <h1 className='p-6 w-full font-bold text-xl text-right rtl'>
        جدید ترین ها از هرچی
      </h1>
      <Marquee pauseOnHover className='[--duration:18s]'>
        {products.map((product, index) => (
          <Link
            href={`/product/${product.code}/${product.name}`}
            key={product.code}
            className={cn(
              "relative w-64 cursor-pointer overflow-hidden rounded-md border flex justify-between items-center flex-col p-3 ",
              // light styles
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              // dark styles
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}>
            <Image
              priority={index === 0 ? true : false}
              src={product.og_image!}
              alt='products'
              width={190}
              height={150}
              className='rounded-md w-auto h-[270px]'
            />
            <p className='mt-1 w-full text-center rtl'>{product.title}</p>
            <div className='relative flex justify-center items-center gap-1 font-[family-name:var(--font-numbers)] rtl'>
              <p
                className={`bg-rose-600 text-slate-50 p-1 rounded-md text-sm overflow-clip ${
                  product.off && Number(product.off) > 0
                    ? "block h-auto"
                    : "hidden p-0 h-0"
                }`}>
                {product.off}%
              </p>
              <p
                className={`flex justify-center items-center gap-1 w-full ${
                  product.off && Number(product.off) > 0
                    ? "line-through"
                    : "underline absolute -top-9 text-lg"
                } `}>
                {Number(removeCommas(product.price!)).toLocaleString("en-US")}
                <span>تومان</span>
              </p>
            </div>
            {product.off && Number(product.off) > 0 && (
              <p className='flex justify-center items-center gap-1 w-full font-[family-name:var(--font-numbers)] text-rose-600 text-lg rtl'>
                {(
                  Number(removeCommas(product.price!)) -
                  (Number(removeCommas(product.price!)) * Number(product.off)) /
                    100
                ).toLocaleString("en-US")}
                <span>تومان</span>
              </p>
            )}
          </Link>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className='[--duration:18s] rtl'>
        {reviews.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className='left-0 absolute inset-y-0 bg-gradient-to-r from-white dark:from-background opacity-45 w-1 pointer-events-none'></div>
      <div className='right-0 absolute inset-y-0 bg-gradient-to-l from-white dark:from-background opacity-45 w-1 pointer-events-none'></div>
    </div>
  );
}
