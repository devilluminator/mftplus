"use client";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { object, string, number, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { editCategory } from "@/server/actions/categories";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type EditCategoryProps = {
  id: number;
  name: string | null;
  link: string | null;
};

function EditCategory({
  category,
  refetch,
}: {
  category: EditCategoryProps;
  refetch: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const editFormSchema = object({
    id: number().required(),
    name: string().required("نام دسته بندی نمی تواند خالی باشد"),
    current_link: string().required("لینک نمی تواند خالی باشد"),
    link: string().required(" لینک نمی تواند خالی باشد"),
  });
  const form = useForm({
    resolver: yupResolver(editFormSchema),
    defaultValues: {
      id: category.id,
      name: category.name ?? "",
      current_link: category.link ?? "",
      link: category.link ?? "",
    },
  });

  function onSubmit(values: InferType<typeof editFormSchema>) {
    console.log(values);
    startTransition(() => {
      return editCategory(values).then((res) => {
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
    <Dialog>
      <DialogTrigger>
        <EditIcon />
      </DialogTrigger>
      <DialogContent className='max-w-[360px]'>
        <DialogHeader>
          <DialogTitle className='pt-6 text-right'>
            {" "}
            ویرایش دسته بندی
          </DialogTitle>
          <DialogDescription className='flex flex-col justify-start items-start'></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 rtl'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={category.name ?? "Name-Tab"}
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
                <FormItem>
                  <FormLabel>لینک</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={category.link ?? "Link-Category"}
                      className='text-left ltr'
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
              className='w-full font-bold'>
              ارسال
              <Spinner show={isPending} className='text-blue-300' />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
