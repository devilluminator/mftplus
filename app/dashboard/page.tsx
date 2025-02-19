"use client";
import React, { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { InferType } from "yup";
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
import { updateUserInfoSchema } from "@/schemas/update-user-info";
import { userQueryOptions } from "@/context/user-query";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Edit3Icon, EditIcon, UserCheck2Icon } from "lucide-react";
import { States, Cities } from "@/types/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateUserInfo } from "@/server/actions/update-user-info";
import allStatesCities from "./state-cities.json";
import addressAsLatLng from "@/lib/geolocation";
import { toast } from "sonner";
import Location from "@/components/map";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

function DashboardPage() {
  const { queryFn, queryKey } = userQueryOptions();
  const { data, refetch } = useQuery(queryKey, () => queryFn());
  const [states, setStates] = useState<States>([]);
  const [cities, setCities] = useState<Cities>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [latAndLng, setLatAndLng] = useState<{ lat: number; lng: number }>({
    lat: Number(data?.data?.user?.lat!),
    lng: Number(data?.data?.user?.lng!),
  });
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: yupResolver(updateUserInfoSchema),
    defaultValues: {
      full_name: "",
      email: "",
      city: "",
      state: "",
      address: "",
      lat: "",
      lng: "",
    },
  });
  const editForm = () => {
    const user = data?.data?.user;
    form.setValue("full_name", user?.full_name || "");
    form.setValue("email", user?.email || "");
    form.setValue("city", user?.city || "");
    form.setValue("state", user?.state || "");
    form.setValue("address", user?.address || "");
    form.setValue("lat", user?.lat || "");
    form.setValue("lng", user?.lng || "");
  };
  const onSubmit = async (values: InferType<typeof updateUserInfoSchema>) => {
    startTransition(async () => {
      const { state, city, address, email, full_name } = values;
      const full_address = `${state}-${city}-${address}`;

      const xyCoordinate = await addressAsLatLng(full_address);
      setLatAndLng({
        lat: xyCoordinate.location.y,
        lng: xyCoordinate.location.x,
      });
      UpdateUserInfo({
        full_name,
        state,
        city,
        address,
        email,
        lat: String(xyCoordinate.location.y),
        lng: String(xyCoordinate.location.x),
      }).then((res) => {
        res?.data?.success
          ? toast.success(res?.data?.message, {
              position: "top-right",
              className: "rtl flex justify-start items-center gap-3",
            })
          : toast.error(res?.data?.message, {
              position: "top-right",
              className: "rtl flex justify-start items-center gap-3",
            });
      });
      // set latitude and longitude to local storage for faster map loading
      localStorage.setItem("lat", String(xyCoordinate.location.y));
      localStorage.setItem("lng", String(xyCoordinate.location.x));
      setIsEditing(false);
      await refetch();
    });
  };
  const openStates = () => {
    setStates(allStatesCities);
  };
  const showCities = (city: string) => {
    allStatesCities.map((item) => {
      item.name === city ? setCities(item.cities) : null;
    });
  };
  return (
    <div className='flex md:flex-row flex-col justify-start items-start gap-3 p-3 border rounded-md container rtl'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-3 shadow-lg backdrop-blur-md p-3 border rounded-md min-w-full md:min-w-[360px]'>
          <h1 className='flex justify-center items-center gap-1 backdrop-blur-sm mb-1 p-3 border rounded-md font-bold text-emerald-600 dark:text-emerald-300 text-lg'>
            {data?.data?.user?.phone_number} <UserCheck2Icon />
          </h1>
          <Button
            type='button'
            variant='secondary'
            onClick={() => {
              editForm();
              setIsEditing(!isEditing);
            }}>
            ویرایش مشخصات فردی{" "}
            {isEditing ? (
              <Edit3Icon className='scale-150' />
            ) : (
              <EditIcon className='scale-150' />
            )}
          </Button>
          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام و نام خانوادگی</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data?.data?.user?.full_name ?? "Full Name"}
                    type='text'
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ایمیل</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data?.data?.user?.email ?? "Email"}
                    type='text'
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='state'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='mt-3 text-current'>استان</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      showCities(value);
                    }}
                    onOpenChange={() => openStates()}
                    disabled={!isEditing}>
                    <SelectTrigger className='justify-end w-full'>
                      <SelectValue
                        placeholder={
                          data?.data?.user?.state
                            ? data.data.user.state
                            : "استان  خود را انتخاب نمایید"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states?.map((state) => (
                        <SelectItem
                          key={state.provinceID}
                          value={state.name}
                          className='justify-end text-right'>
                          {state.name}
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
            name='city'
            render={({ field }) => (
              <FormItem className='mt-3'>
                <FormLabel className='text-current'>شهر</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const current_location = cities.filter(
                        (c) => c.name === value,
                      )[0];
                      setLatAndLng({
                        lat: Number(current_location.lat),
                        lng: Number(current_location.lon),
                      });
                    }}
                    onOpenChange={(open) => {
                      cities.length === 0 &&
                        open &&
                        toast.error(
                          "لطفا در ابتدا استان خود را انتخاب نمایید",
                          {
                            position: "top-right",
                            className:
                              "rtl flex justify-start items-center gap-3 ",
                          },
                        );
                    }}
                    disabled={!isEditing}>
                    <SelectTrigger className='justify-end w-full'>
                      <SelectValue
                        placeholder={
                          data?.data?.user?.city
                            ? data?.data?.user.city
                            : "شهر خود را انتخاب نمایید"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem
                          key={city.name}
                          value={city.name}
                          className='justify-end text-right'>
                          {city.name}
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
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>آدرس</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data?.data?.user?.address ?? "Address"}
                    type='text'
                    autoComplete='off'
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isPending || !isEditing}
            className='w-full font-semibold'>
            تایید و ارسال <Spinner show={isPending} className='text-blue-300' />
          </Button>
        </form>
      </Form>
      <div className='flex flex-col justify-start items-start w-full text-sm text-right'>
        <Location lat={latAndLng.lat} lng={latAndLng.lng} />

        <Popover>
          <PopoverTrigger className='opacity-75 hover:opacity-100 backdrop-blur-sm my-3 p-3 border rounded-md'>
            نکاتی برای دریافت دقیق تر موقعیت - Geolocation
          </PopoverTrigger>
          <PopoverContent className=' font-bold font-[family-name:var(--font-numbers)] [&>p]:text-sm [&>p]:font-thin rtl [&>p]:border-b [&>p]:my-1'>
            <p>
              1.تا جایی که ممکن است ترتیب قرار گرفتن اجزا آدرس به صورت زیر باشد
            </p>
            <p> استان - شهر / روستا - میدان - خیابان - کوچه - پلاک</p>
            <p>
              نکته: شماره پلاک در شهرهای تهران، مشهد، تبریز، کرج قابل استفاده
              است.
            </p>
            <p>
              2.حتما همه اجزا آدرس با جدا کننده space از هم جدا شده باشند. مثال
              : شهیدبابایی بهتر است با جدا کننده به صورت شهید بابایی ارسال شود.
            </p>
            <p>
              3.مشخصات مربوط به poi ها مانند نام ساختمان طبقات و برجها تا جایی
              که ممکن است از آدرس حذف شود. ﻿مثال: ﻿آذربایجان شرقی تبریز خیابان
              ارتش شمالی کوچه بازارچه رنگی ساختمان رضوی به آدرس زیر تغییر یابد
              آذربایجان شرقی تبریز خیابان ارتش شمالی کوچه بازارچه رنگی
            </p>
            <p>
              4.اگر مقصد آدرس روستا است بعد از استان بلافاصله نام روستا آورده
              شود و دیگر نیازی به نام شهر نیست
            </p>
            <p className='text-red-600 dark:text-red-300'>
              فیلتر شکن وصل نباشه API داخلیه fetch نمیکنه :)
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default DashboardPage;
