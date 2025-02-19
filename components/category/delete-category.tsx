"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCategory } from "@/server/actions/categories";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteCategoryProps = {
  id: number;
  name: string | null;
};
function DeleteCategory(props: DeleteCategoryProps) {
  const { refetch } = useQuery({
    queryKey: ["category"],
  });

  const deleteCategoryByID = async () => {
    const res = await deleteCategory({ id: props.id });
    if (res.success) {
      toast(res.message, {
        position: "top-right",
        className: "rtl flex justify-start items-center gap-3",
      });
      await refetch();
      return;
    }
    toast.error(res.message, {
      position: "top-right",
      className: "rtl flex justify-start items-center gap-3",
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className='text-destructive'>
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-[360px]'>
        <AlertDialogHeader className='flex flex-col justify-start items-start w-full rtl'>
          <AlertDialogTitle>آیا مطمئن هستید؟ - {props.name}</AlertDialogTitle>
          <AlertDialogDescription>غیر قابل برگشت</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>خیر - بازگشت</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteCategoryByID}
            className='bg-destructive font-bold'>
            بله حذف شود
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategory;
