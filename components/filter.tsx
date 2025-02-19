"use client";
import React, { useTransition } from "react";
import { useQueryState } from "nuqs";
import { searchParams } from "@/lib/search-params";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
//
type FilterProps = {
  minPrice: number;
  maxPrice: number;
  Colors: (string | undefined)[];
  brands: (string | null)[];
  sizes: (string | undefined)[];
  special_sale: (number | null)[];
  products_length: number;
};
//
function Filter(props: FilterProps) {
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useQueryState(
    "color",
    searchParams.color.withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const [size, setSize] = useQueryState(
    "size",
    searchParams.size.withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const [brand, setBrand] = useQueryState(
    "brand",
    searchParams.brand.withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const [, setMin] = useQueryState(
    "minPrice",
    searchParams.minPrice.withDefault(props.minPrice).withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const [, setMax] = useQueryState(
    "maxPrice",
    searchParams.maxPrice.withDefault(props.maxPrice).withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const [price, setPrice] = React.useState<number[]>([
    props.minPrice,
    props.maxPrice,
  ]);
  const [specialSale, setSpecialSale] = useQueryState(
    "specialSale",
    searchParams.specialSale.withOptions({
      shallow: false,
      startTransition,
    }),
  );
  const handleChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - 1), price[1]]);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + 1)]);
    }
    setMin(newValue[0]);
    setMax(newValue[1]);
  };

  return (
    <div
      className={cn(
        isPending ? "text-slate-600" : "text-current",
        "transition-colors flex flex-col md:flex-row justify-start items-start border drop-shadow-sm p-3 mb-3 gap-3 w-full sticky top-[81px] md:top-[126px] z-[12] bg-white dark:bg-zinc-950 rounded-md rtl",
      )}>
      <div className='flex flex-col justify-start items-center gap-3 p-1 border rounded-md min-w-[261px] h-[117px] rtl'>
        <span className='flex justify-start items-center gap-1 px-1 rounded-sm w-full select-none rtl'>
          <p className='pl-[3px]'>کم ترین قیمت</p>
          <p className='bg-emerald-300 border rounded-sm min-w-[90px] font-[family-name:var(--font-numbers)] font-bold dark:text-slate-900 text-center'>
            {price[0].toLocaleString("en-US")}
          </p>
          <p className='font-[family-name:var(--font-numbers)] font-bold'>
            تومان
          </p>
        </span>
        <span className='flex justify-start items-center gap-1 px-1 rounded-sm w-full select-none rtl'>
          <p> بیشترین قیمت </p>
          <p className='bg-emerald-300 border rounded-sm min-w-[90px] font-[family-name:var(--font-numbers)] font-bold dark:text-slate-900 text-center'>
            {price[1].toLocaleString("en-US")}
          </p>
          <p className='font-[family-name:var(--font-numbers)] font-bold'>
            تومان
          </p>
        </span>
        <Box
          sx={{
            width: "90%",
          }}>
          <Slider
            getAriaLabel={() => "Minimum distance"}
            value={price}
            onChange={handleChange}
            valueLabelDisplay='off'
            color='primary'
            min={props.minPrice}
            max={props.maxPrice}
            disableSwap
          />
        </Box>
      </div>
      <div className='flex flex-col justify-start items-start gap-1 w-full md:w-[360px] h-full'>
        <Popover>
          <PopoverTrigger className='flex justify-start items-center gap-3 p-2 border rounded-md w-full text-right hover:underline-offset-0 hover:no-underline rtl'>
            رنگ بندی{" "}
            {color && (
              <span
                className='p-3 border rounded-full w-3 h-3'
                style={{ backgroundColor: color }}></span>
            )}
          </PopoverTrigger>
          <PopoverContent className='gap-1 grid grid-cols-9 rtl'>
            {props.Colors.map(
              (color, index) =>
                color && (
                  <span
                    key={index + "_color"}
                    className='hover:shadow-lg p-3 border rounded-full cursor-pointer'
                    style={{ backgroundColor: color }}
                    onClick={() => setColor(color!)}></span>
                ),
            )}
          </PopoverContent>
        </Popover>
        <Select onValueChange={(value) => setSize(value)} value={size}>
          <SelectTrigger className='rtl'>
            <SelectValue placeholder='سایز' />
          </SelectTrigger>
          <SelectContent className='rtl'>
            {props.sizes.map((size, index) => (
              <SelectItem
                key={index + "_size"}
                value={size ? size.toLocaleUpperCase() : ""}>
                {size?.toLocaleUpperCase() === "LG"
                  ? "L"
                  : size?.toLocaleUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setBrand(value)} value={brand}>
          <SelectTrigger className='rtl'>
            <SelectValue placeholder='برند' />
          </SelectTrigger>
          <SelectContent className='rtl'>
            {props.brands.map((brand, index) => (
              <SelectItem key={index + "_brand"} value={brand ? brand : ""}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-3 space-x-2 p-3 border rounded-md ltr'>
        <Label htmlFor='airplane-mode'>فروش ویژه</Label>
        <Switch
          className='scale-150'
          onCheckedChange={() => setSpecialSale(specialSale ? 0 : 1)}
        />
      </div>
      <div className='left-0 fixed md:relative flex md:flex-row flex-col justify-start items-start gap-1 px-3 rounded-md'>
        <Button
          variant='secondary'
          className={`${color ? "flex" : "hidden"}`}
          onClick={() => {
            setColor("");
          }}>
          حذف رنگ{" "}
          <span
            className='border rounded-full w-3 h-3'
            style={{ backgroundColor: color }}></span>
        </Button>
        <Button
          variant='secondary'
          className={`${size ? "flex" : "hidden"}`}
          onClick={() => {
            setSize("");
          }}>
          حذف سایز
        </Button>
        <Button
          variant='secondary'
          className={`${brand ? "flex" : "hidden"}`}
          onClick={() => {
            setBrand("");
          }}>
          حذف برند
        </Button>
      </div>

      <p className='mr-0 md:mr-auto font-[family-name:var(--font-numbers)] text-sm'>
        تعداد محصولات {props.products_length} عدد
      </p>
    </div>
  );
}

export default Filter;
