import React, { useRef, useState, useTransition } from "react";
import { productSchema } from "@/schemas/products";
import { InferType } from "yup";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowBigLeftIcon, Edit, Save } from "lucide-react";
import { Product } from "@/types/products";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UploadButton } from "@/lib/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { categoryQueryOptions } from "@/context/category-query";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";
import { Spinner } from "../ui/spinner";
import { editProduct } from "@/server/actions/products";
import { colorsPallet } from "@/lib/hex-colors";
import { cn } from "@/lib/utils";

function EditProduct({
  product,
  refetch,
}: {
  product: Product[0];
  refetch: () => void;
}) {
  const { queryKey, queryFn } = categoryQueryOptions();
  const { data } = useQuery([queryKey, "products"], () => queryFn());
  const [percentage, setPercentage] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [colors, setColors] = useState<string>(product.colors ?? "");
  const [currentImage, setCurrentImage] = useState<string>(
    product.og_image ?? "",
  );
  const colorInputRef = useRef<HTMLInputElement>(null);
  const productImageRef = useRef<HTMLImageElement>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      id: product.id,
      name: product.name!,
      og_image: product.og_image!,
      description: product.description!,
      category: product.category!,
      code: product.code!,
      price: product.price!,
      off: product.off!,
      size: product.size!,
      colors: product.colors!,
      material: product.material!,
      brand: product.brand!,
      gender: product.gender!,
      special_off: product.special_off!,
      created_at: product.created_at!,
      updated_at: Date.now().toString(),
    },
  });
  function onSubmit(values: InferType<typeof productSchema>) {
    startTransition(() => {
      return editProduct(values).then((res) => {
        if (res?.data?.success) {
          toast(res.data.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3",
          });
          refetch();
          return;
        }
        toast.error(res?.data?.message, {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3",
        });
      });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className='pt-[6]'>
        <Edit />
      </AlertDialogTrigger>
      <AlertDialogContent className='min-w-[72%]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right rtl'>
            ویرایش محصول - {product.name}
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-right rtl'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='text-right'>
                      <FormLabel>نام</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={product.name ?? "product-name"}
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
                    <FormItem className='text-right'>
                      <FormLabel>قیمت</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={product.price ?? "product-price"}
                          {...field}
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
                    <FormItem className='text-right'>
                      <FormLabel>کد-محصول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={product.code ?? "product-code"}
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
                    <FormItem className='text-right'>
                      <FormLabel>تخفیف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={product.off ?? "product-off"}
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
                              <SelectValue
                                placeholder={
                                  product.special_off === 1 ? "بله" : "خیر"
                                }
                              />
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
                              <SelectValue
                                placeholder={
                                  data?.data?.categories.find(
                                    (item) => item.link === product.category,
                                  )?.name ?? "انتخاب دسته بندی"
                                }
                              />
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
                          placeholder={product.brand ?? "product-brand"}
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
                              colorInputRef.current.value +=
                                event.target.value + ",";
                              setColors(colorInputRef.current.value);
                              form.setValue(
                                "colors",
                                colorInputRef.current.value,
                              );
                              console.log(colorInputRef.current.value);
                            }
                          }}
                        />
                        <FormControl>
                          <Input
                            ref={colorInputRef}
                            className='backdrop-blur-sm placeholder:text-right ltr'
                            placeholder='نمایش کد رنگ-(رنگ های) انتخاب شده'
                            defaultValue={product.colors!}
                            onChange={(event) => {
                              setColors(event.target.value);
                              form.setValue("colors", event.target.value);
                            }}
                            type='text'
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
                          placeholder={product.gender ?? "X"}
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
                    setImageLoading(true);
                    form.setValue("og_image", res[0].url);
                    setCurrentImage(res[0].url);
                  }}
                />
                <div className='relative flex justify-start items-center'>
                  <FormField
                    control={form.control}
                    name='og_image'
                    render={() => <FormMessage />}
                  />
                  {imageLoading && (
                    <Skeleton className='right-0 z-[3] absolute rounded-sm w-[60px] h-[90px]' />
                  )}

                  <span className='flex justify-end items-center gap-3'>
                    <Image
                      ref={productImageRef}
                      src={currentImage}
                      alt='product og_image'
                      width={60}
                      height={90}
                      className={cn(
                        "border rounded-sm w-auto min-w-[60px] h-auto min-h-[90px] max-h-[90px] transition-opacity",
                        imageLoading ? "opacity-0" : "opacity-100",
                      )}
                      onLoad={() => {
                        setPercentage(0);
                        setImageLoading(false);
                      }}
                    />
                  </span>

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

export default EditProduct;
