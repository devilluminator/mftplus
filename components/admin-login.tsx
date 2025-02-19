"use client";
import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { string, object, InferType } from "yup";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { adminLoginAction } from "@/server/actions/admin-login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

function AdminLoginForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formSchema = object({
    username: string().required("نام کاربری نمی تواند خالی باشد"),
    password: string().required("رمز عبور نمی تواند خالی باشد"),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(values: InferType<typeof formSchema>) {
    startTransition(() => {
      return adminLoginAction(values).then((res) => {
        if (res?.data?.success) {
          toast(res.data.success, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3",
          });
          return router.refresh();
        }
        toast.error(res?.data?.failure, {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3",
        });
      });
    });
  }
  return (
    <div className='flex justify-center items-center w-full'>
      <Card className='backdrop-blur-md mt-36 md:mt-24 max-w-[360px] rtl'>
        <CardHeader>
          <CardTitle className='flex justify-start items-center gap-1 text-xl'>
            <Image
              src='/icon.png'
              alt='harchi icon'
              width={45}
              height={45}
              className='dark:invert'
              quality={100}
              priority={true}
            />
            پنل مدیریت
          </CardTitle>
          <CardDescription className='flex flex-col justify-end items-end'>
            <span>username: admin</span>
            <span>password: admin</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام کاربری</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Username'
                        type='text'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
                        type='password'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className='w-full font-bold tex-lg'
                disabled={isPending}
                type='submit'>
                <Spinner show={isPending} className='text-blue-300' />
                ورود
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className='space-y-2 w-[350px]'>
            <div className='flex justify-start items-center space-x-4 pb-1 border-b'>
              <CollapsibleTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <ChevronsUpDown className='w-4 h-4' />
                  <span className='sr-only'>Toggle</span>
                  <h1 className='font-semibold text-sm'>یه کوچولو توضیح</h1>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='space-y-2'>
              <p className='font-bold font-[family-name:var(--font-numbers)] text-sm'>
                در کل ترجیح میدم پنل سرور رو یه هاست جدا باشه هم واسه
                static-files هم کانکشن واسه Socket.io-server و غیره از لحاظ
                امنیتی هم بهتره
              </p>
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminLoginForm;
