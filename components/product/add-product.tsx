"use client";
import React, { useRef, useState, useTransition } from "react";
import {
  PlusSquareIcon,
  Save,
  LucideInfo,
  ChevronsUpDown,
  ArrowBigLeftIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProduct } from "@/server/actions/products";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InferType } from "yup";
import { Spinner } from "../ui/spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { categoryQueryOptions } from "@/context/category-query";
import { useQuery } from "@tanstack/react-query";
import { productSchema } from "@/schemas/products";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/upload";
import Image from "next/image";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { colorsPallet } from "@/lib/hex-colors";

type ProductsPageProps = {
  refetch: () => void;
};

function AddProduct(props: ProductsPageProps) {
  const { queryKey, queryFn } = categoryQueryOptions();
  const { data } = useQuery([queryKey, "products"], () => queryFn());
  const [imageSrc, setImageSrc] = useState<{
    url: string | null;
    key: string;
    isLoading: boolean;
  }>({ url: "", key: "", isLoading: false });
  const [colors, setColors] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      og_image: "",
      description: "",
      category: "",
      code: "",
      price: "",
      off: "",
      size: "",
      colors: "#2619E3",
      material: "",
      brand: "",
      gender: "",
      special_off: 0,
      created_at: Date.now().toString(),
    },
  });
  const onSubmit = (data: InferType<typeof productSchema>) => {
    startTransition(() => {
      return addProduct(data).then((res) => {
        if (res?.data?.success) {
          toast(res.data.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3",
          });
          form.reset();
          setImageSrc({ url: null, key: "", isLoading: false });
          props.refetch();
          return;
        }
        toast.error(res?.data?.message, {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3",
        });
      });
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='border font-bold' variant='secondary'>
          افزودن محصول
          <PlusSquareIcon className='scale-150' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='min-w-[72%]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>
            اضافه کردن محصول به لیست
          </AlertDialogTitle>
          <AlertDialogDescription
            className='w-full font-[family-name:var(--font-numbers)] font-bold text-sm rtl'
            asChild>
            <Collapsible>
              <CollapsibleTrigger className='flex justify-start items-start gap-1 opacity-75 hover:opacity-100 border-b text-right'>
                <LucideInfo className='scale-75' />
                یه کوچولو توضیح
                <ChevronsUpDown className='scale-75' />
              </CollapsibleTrigger>
              <CollapsibleContent className='opacity-75 border-b text-right'>
                * دسته بندی محصولات ما در این بخش در واقع همون (افزودن دسته بندی
                Tab-Link) در قسمت داشبورد هستند
              </CollapsibleContent>
            </Collapsible>
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-right rtl'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام محصول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-name'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قیمت</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-price'
                          className='backdrop-blur-sm'
                          {...field}
                          onChange={(e) => {
                            const formattedValue = parseFloat(
                              e.target.value.replace(/,/g, ""),
                            ).toLocaleString("en-US");
                            field.onChange(formattedValue);
                            if (
                              e.target.value === "" ||
                              e.target.value.trim().length === 0
                            ) {
                              field.onChange("0");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>کد محصول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-code'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='off'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تخفیف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-off'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='special_off'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تخفیف ویژه (شگفت انگیزا مثلا!!!)</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='rtl'>
                              <SelectValue placeholder='خیر' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='rtl'>
                            <SelectItem value='0'>خیر</SelectItem>
                            <SelectItem value='1'>بله</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>*دسته بندی</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='rtl'>
                              <SelectValue placeholder='انتخاب دسته بندی' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='rtl'>
                            {data?.data?.categories.map((category) => (
                              <SelectItem
                                key={`select-category-id${category.id}`}
                                value={category.link!}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='brand'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام برند</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-brand'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='colors'
                  render={() => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center gap-1'>
                        رنگ بندی -{" "}
                        {colorsPallet(colors).map((color, index) => (
                          <span
                            key={`color-pallet-id-${index}`}
                            className='p-1 border rounded-full w-6 h-6'
                            style={{
                              backgroundColor: color,
                            }}></span>
                        ))}
                      </FormLabel>
                      <span className='flex justify-center items-center gap-1'>
                        <Input
                          className='backdrop-blur-sm m-0 p-0 border w-9 h-9'
                          type='color'
                          onChange={(event) => {
                            if (colorInputRef.current) {
                              setColors(colorInputRef.current.value);
                              colorInputRef.current.value +=
                                event.target.value + ",";
                              form.setValue(
                                "colors",
                                colorInputRef.current.value ??
                                  event.target.value + ",",
                              );
                            }
                          }}
                        />
                        <FormControl>
                          <Input
                            ref={colorInputRef}
                            className='backdrop-blur-sm placeholder:text-right ltr'
                            placeholder='نمایش کد رنگ-(رنگ های) انتخاب شده'
                            type='text'
                            onChange={(event) => {
                              setColors(event.target.value);
                              form.setValue("colors", event.target.value + ",");
                            }}
                          />
                        </FormControl>
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>جنسیت - (اختیاری)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='مردانه-زنانه-دخترانه... هرچی'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='material'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>جنس محصول - (اختیاری)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='product-material'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='size'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سایز محصول - (اختیاری)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='مثلا-L-XL-42-45...'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>توضیحات</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='product-description'
                          className='backdrop-blur-sm'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <UploadButton
                  endpoint='imageUploader'
                  className='custom-class p-3 border rounded-md'
                  content={{
                    button({ ready }) {
                      if (ready)
                        return (
                          <div className='w-[120px] text-sm text-center'>
                            بارگذاری تصویر
                          </div>
                        );
                      return (
                        <div className='w-[120px] text-sm text-center'>
                          آماده شدن
                        </div>
                      );
                    },
                  }}
                  onUploadBegin={() => {
                    console.log("Upload Starting");
                    form.clearErrors("og_image");
                  }}
                  onUploadProgress={async (progress) => {
                    setPercentage(progress);
                  }}
                  onUploadError={(error) => {
                    toast.error(error.message, {
                      position: "top-right",
                      className: "rtl flex justify-center items-center",
                    });
                  }}
                  onClientUploadComplete={(res) => {
                    setImageSrc({
                      url: res[0].url,
                      key: res[0].key,
                      isLoading: true,
                    });
                    form.setValue("og_image", res[0].url);
                  }}
                />
                <div className='relative flex justify-start items-center'>
                  <FormField
                    control={form.control}
                    name='og_image'
                    render={() => <FormMessage />}
                  />
                  {imageSrc.isLoading && (
                    <Skeleton className='right-0 z-[3] absolute rounded-sm w-[60px] h-[90px]' />
                  )}
                  {imageSrc.url && (
                    <span className='flex justify-end items-center gap-3'>
                      <Image
                        src={imageSrc.url}
                        alt='product og_image'
                        width={60}
                        height={90}
                        className='border rounded-sm w-auto min-w-[60px] h-auto min-h-[90px] max-h-[90px]'
                        onLoad={() => {
                          setPercentage(0);
                          setImageSrc((prev) => ({
                            ...prev,
                            isLoading: false,
                          }));
                        }}
                      />
                    </span>
                  )}

                  <span
                    className={`max-h-[90px] scale-50 flex justify-center items-center ${
                      percentage > 0 ? "opacity-100" : "opacity-0"
                    }`}>
                    <AnimatedCircularProgressBar
                      max={100}
                      min={0}
                      value={percentage}
                      gaugePrimaryColor='rgb(79 70 229)'
                      gaugeSecondaryColor='rgba(0, 0, 0, 0.1)'
                    />
                  </span>
                </div>
              </div>
              <div className='flex justify-center items-center gap-3 pt-3'>
                <AlertDialogCancel
                  asChild
                  className='bg-secondary m-0 p-0'
                  onClick={() => form.clearErrors()}>
                  <Button
                    variant='secondary'
                    type='button'
                    className='w-full font-bold'>
                    <ArrowBigLeftIcon className='scale-150' />
                    بازگشت
                  </Button>
                </AlertDialogCancel>
                <Button
                  type='submit'
                  className='w-full font-bold'
                  disabled={isPending}>
                  <Spinner show={isPending} className='text-blue-300' />
                  ذخیره شود <Save className='scale-150' />
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddProduct;
