"use client";
import { LogOutIcon, MenuIcon, StarsIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/context/user-query";
import { useRouter } from "nextjs-toploader/app";
// 📘 The ModeToggle component from our ShadCN UI library => Dark, Light, and System themes.
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import Separator from "@/components/ui/separator";
import CategoriesAsPage from "./categories-as-page";

const SideMenu = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { queryKey, queryFn } = userQueryOptions();
  const { data, refetch } = useQuery(queryKey, () => queryFn());
  const logout = async () =>
    await fetch("/api/logout", {
      method: "GET",
    }).then(async () => {
      await refetch();
      toast.success("خروج از حساب کاربری با موفقیت انجام شد.", {
        position: "top-right",
        className: "rtl flex justify-start items-center gap-3 ",
      });
      return router.push("/");
    });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='secondary'
          className='border min-h-[48px] md:min-h-min'>
          <MenuIcon className='scale-150' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className='h-full'>
          <SheetTitle className='flex justify-start items-center pb-3 w-full'>
            <ModeToggle />
          </SheetTitle>
          <Separator orientation='horizontal' className='my-3' />
          <SheetDescription className='flex flex-col h-full'>
            <Link
              href='/admin-dashboard'
              className='flex justify-end items-center gap-3 bg-secondary opacity-75 hover:opacity-100 p-3 rounded-md font-bold transition-opacity'>
              پنل مدیریت
              <StarsIcon />
            </Link>
            <Separator orientation='horizontal' className='my-3' />
            <CategoriesAsPage />
            {data?.data?.user?.uuid && (
              <Button
                variant='destructive'
                className='mt-auto'
                disabled={isPending}
                onClick={() => startTransition(logout)}>
                خروج از حساب کاربری <LogOutIcon />
              </Button>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
