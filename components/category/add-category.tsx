"use client";
import React, { useTransition } from "react";
import { Save, Star, Link } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addCategory } from "@/server/actions/categories";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { string, object, InferType } from "yup";
import { Spinner } from "../ui/spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { categoryQueryOptions } from "@/context/category-query";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditCategory from "./edit-category";
import DeleteCategory from "./delete-category";

function AddCategory() {
  const { queryFn, queryKey } = categoryQueryOptions();
  const { data, refetch, isRefetching } = useQuery(queryKey, () => queryFn());
  const [isPending, startTransition] = useTransition();
  const formSchema = object({
    name: string().required("نام دسته بندی نمی تواند خالی باشد"),
    link: string().required(" لینک نمی تواند خالی باشد"),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
    },
  });
  function onSubmit(values: InferType<typeof formSchema>) {
    startTransition(() => {
      return addCategory(values).then(async (res) => {
        if (res?.data?.success) {
          toast(res.data.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3",
          });
          await refetch();
          form.reset();
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
    <div className='flex md:flex-row flex-col justify-start items-start gap-3 space-y-3 p-3 border rounded-md w-full rtl'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='backdrop-blur-sm p-3 border rounded-md w-full md:w-auto'>
          <h1 className='flex justify-start items-center gap-3 mb-3 font-bold text-lg'>
            افزودن دسته بندی (Tab - Link)
          </h1>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Star className='inline-block ml-1' />
                  نام دسته بندی را وارد کنید
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='category-name'
                    className='backdrop-blur-sm w-full md:w-[360px]'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='link'
            render={({ field }) => (
              <FormItem className='mt-3'>
                <FormLabel>
                  <Link className='inline-block ml-1' />
                  یک لینک برای دسته بندی انتخاب کنید
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='category-link'
                    className='backdrop-blur-sm w-full md:w-[360px] lowercase'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isPending}
            className='mt-3 w-full md:w-[360px] font-semibold'>
            <Save className='scale-150' />
            ذخیره شود
            <Spinner show={isPending} className='text-blue-300' />
          </Button>
        </form>
      </Form>
      <Table className='backdrop-blur-sm'>
        <TableCaption className='p-1 border rounded-md'>
          <Spinner
            show={isRefetching}
            className='text-emerald-600 dark:text-emerald-300'
          />
          لیست لینک های موجود - تعداد {data?.data?.categories.length}{" "}
          (app/[category-link]) - Dynamic Routes
        </TableCaption>
        <TableHeader>
          <TableRow className='[&>*]:text-right backdrop-blur-sm'>
            <TableHead className='w-[90px]'>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.categories?.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className='font-medium'>{index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.link}</TableCell>
              <TableCell>
                <EditCategory category={category} refetch={refetch} />
              </TableCell>
              <TableCell className='text-destructive'>
                <DeleteCategory id={category.id} name={category.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AddCategory;
