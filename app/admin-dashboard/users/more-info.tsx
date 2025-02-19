import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserInfo } from "@/types/user-info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Location from "@/components/map";
import { updateUserRole } from "@/server/actions/update-user-info";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ShineBorder } from "@/components/magicui/shine-border";

function ShowMoreInfo({
  user,
  refetch,
}: {
  user: UserInfo;
  refetch: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const setUserRole = async (role: string) => {
    await updateUserRole({ id: Number(user.id), role }).then((res) => {
      startTransition(() => {
        if (res?.data?.success) {
          toast.success(res?.data?.message, {
            position: "top-right",
            className: "rtl flex justify-start items-center gap-3",
          });
          return refetch();
        }
        toast.error(res?.data?.message, {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3",
        });
        return;
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger className='opacity-75 hover:opacity-100 font-bold text-3xl cursor-pointer'>
        ...
      </DialogTrigger>
      <DialogContent className='m-0 p-0 max-w-[360px] md:max-w-[33%]'>
        <ShineBorder
          borderWidth={3}
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          className='w-full'>
          <DialogHeader className='w-full'>
            <DialogTitle className='pt-6 pb-3 text-right'>
              مشخصات فردی
            </DialogTitle>
            <DialogDescription className='flex flex-col justify-start items-start gap-1 rtl [&>span]:border-b [&>span]:pb-3 [&>span]:w-full [&>span]:text-right'>
              <span>
                نام کامل : <span className='font-bold'>{user.full_name}</span>
              </span>
              <span>
                شماره تماس :{" "}
                <span className='font-bold'>{user.phone_number}</span>
              </span>
              <span>
                استان : <span className='font-bold'>{user.state}</span>
              </span>
              <span>
                شهر : <span className='font-bold'>{user.city}</span>
              </span>
              <span className='flex justify-start items-center gap-1 pt-3 w-full'>
                سطح دسترسی :
                <Select onValueChange={setUserRole}>
                  <SelectTrigger className='max-w-[90px] font-bold'>
                    <SelectValue
                      className='capitalize'
                      placeholder={user.role}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='admin'>admin</SelectItem>
                    <SelectItem value='user'>user</SelectItem>
                  </SelectContent>
                </Select>
                <Spinner show={isPending} className='mr-3 text-blue-300' />
              </span>
              <span>
                آدرس : <span className='font-bold'>{user.address}</span>
              </span>
            </DialogDescription>
            <Location lat={Number(user.lat)} lng={Number(user.lng)} />
          </DialogHeader>
        </ShineBorder>
      </DialogContent>
    </Dialog>
  );
}

export default ShowMoreInfo;
