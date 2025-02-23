"use client";
import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User2Icon } from "lucide-react";
import { checkUserAndSave, checkPin } from "@/server/actions/save-new-user";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { registerValidation } from "@/types/registration-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Countdown from "react-countdown";
import { useRouter } from "nextjs-toploader/app";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/context/user-query";
import Link from "next/link";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShineBorder } from "@/components//magicui/shine-border";
import { useTheme } from "next-themes";

function RegisterDialog() {
  const { theme } = useTheme();
  // ✅ Separate query function for user as an option
  const { queryKey, queryFn } = userQueryOptions();
  const { data, refetch, isFetched } = useQuery(queryKey, () => queryFn());
  const router = useRouter();
  // ✅ Handling async server side functions for UIs => Loading stuff
  const [isPending, startTransition] = useTransition();
  // ✅ States
  const [pinCodeIsOpen, setPinCodeIsOpen] = useState<boolean>(false);
  // ✅ Refs
  const phoneNumberInputRef = React.useRef<HTMLInputElement>(null);
  const pinInputRef = React.useRef<HTMLInputElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  // ✅ No need to use form (form-action or form-submitting) for this simple dialog
  // checkUserAndSave & checkPin => server side action
  const handleRegistration = () => {
    // ✅ If we got the pin code,
    if (pinCodeIsOpen) {
      const { pin, phone_number } = registerValidation.cast({
        phone_number: phoneNumberInputRef.current?.value,
        pin: pinInputRef.current?.value,
      });
      if (!pin || pin.trim().length === 0)
        return toast.error("کد ورود وارد نشده است", {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3 ",
        });
      return startTransition(() => {
        checkPin(phone_number, pin).then(async (res) => {
          if (res.success) {
            toast.success(res.message, {
              position: "top-right",
              className: "rtl flex justify-start items-center gap-3 ",
            });
            closeButtonRef.current?.click();
            // ✅ React query new fetching data
            await refetch();
            isFetched ? router.push("/dashboard") : null;
            return;
          }
          toast.error(res.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3 ",
          });
        });
      });
    }
    // ✅ Phone number section
    const { phone_number } = registerValidation.cast({
      phone_number: phoneNumberInputRef.current?.value,
    });
    if (!phone_number || phone_number.trim().length === 0)
      return toast.error("شماره همراه وارد نشده است", {
        position: "top-right",
        className: "rtl flex justify-start items-center gap-3 ",
      });
    startTransition(() => {
      // ✅ its works like next-safe-action library here
      checkUserAndSave(phone_number).then((res) => {
        if (res.success) {
          toast.success(res.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3 ",
          });
          return setPinCodeIsOpen(true);
        }
        toast.error(res.message, {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3 ",
        });
      });
    });
  };
  // ✅ If user is logged in, we don't need to show the dialog
  if (data?.data?.user?.uuid)
    return (
      <Link href='/dashboard'>
        <Button className='min-h-[48px] md:min-h-fit font-bold' asChild>
          <RainbowButton>
            <span className='hidden md:block'>
              {data.data.user?.full_name ?? "حساب کاربری "}
            </span>
            <User2Icon className='md:hidden block scale-150' />
          </RainbowButton>
        </Button>
      </Link>
    );
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='min-h-[48px] md:min-h-fit font-bold' asChild>
          <RainbowButton>
            <span className='hidden md:flex'>ورود / ثبت نام </span>
            <User2Icon className='md:hidden block scale-150' />
          </RainbowButton>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='m-0 p-0 rounded-md max-w-[390px]'>
        <ShineBorder
          borderWidth={1}
          color={theme === "dark" ? "white" : "black"}
          className='py-6 w-full'>
          <AlertDialogHeader>
            <AlertDialogTitle className='w-full text-sm text-right'>
              شماره همراه خود را وارد کنید
            </AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                type='text'
                ref={phoneNumberInputRef}
                placeholder='شماره همراه'
                className='mt-3 min-w-[330px] font-[family-name:var(--font-numbers)] font-semibold rtl'
                disabled={pinCodeIsOpen}
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                  event.key === "Enter" ? handleRegistration() : null
                }
              />
            </AlertDialogDescription>
            <div
              className={`flex justify-center items-center mt-3 flex-col rounded-md overflow-clip transition-all ${
                pinCodeIsOpen ? "h-[120px] pt-3" : "h-0 p-0"
              }`}>
              <span className='my-3 w-full font-bold text-sm text-right'>
                کد ارسال شده را وارد نمایید
              </span>
              <InputOTP
                maxLength={6}
                ref={pinInputRef}
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                  event.key === "Enter" ? handleRegistration() : null
                }>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {pinCodeIsOpen && (
                <Countdown
                  className='mt-3 font-[family-name:var(--font-numbers)] font-bold text-lg'
                  onComplete={() => {
                    toast.error("زمان کد ورود به پایان رسیده است", {
                      position: "top-right",
                      className: "rtl flex justify-start items-center gap-3",
                    });
                    setPinCodeIsOpen(false);
                  }}
                  date={Date.now() + 180000} // 3min
                />
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex justify-start items-center mt-3'>
            <AlertDialogCancel asChild ref={closeButtonRef}>
              <Button
                variant='secondary'
                className='mr-auto w-[330px] md:w-[160px]'
                onClick={() => {
                  setPinCodeIsOpen(false);
                  phoneNumberInputRef.current!.value = "";
                  pinInputRef.current!.value = "";
                }}>
                بازگشت
              </Button>
            </AlertDialogCancel>

            <Button
              className='flex justify-center items-center gap-1 w-[330px] md:w-[160px]'
              disabled={isPending}
              onClick={handleRegistration}>
              {pinCodeIsOpen ? "تایید" : "ارسال کد ورود "}{" "}
              <Spinner show={isPending} className='text-blue-300' />
            </Button>
          </AlertDialogFooter>
        </ShineBorder>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RegisterDialog;
