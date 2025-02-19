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
import { deleteProduct } from "@/server/actions/products";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteProductProps = {
  id: number;
  name: string | null;
  refetch: () => void;
};
function DeleteProduct(props: DeleteProductProps) {
  const deleteProductByID = async () => {
    const res = await deleteProduct({ id: props.id });
    if (res.success) {
      toast(res.message, {
        position: "top-right",
        className: "rtl flex justify-start items-center gap-3",
      });
      props.refetch();
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
          <AlertDialogTitle className='text-sm text-right'>
            آیا مطمئن هستید؟ - {props.name}
          </AlertDialogTitle>
          <AlertDialogDescription>غیر قابل برگشت</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>خیر - بازگشت</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteProductByID}
            className='bg-destructive font-bold'>
            بله حذف شود
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProduct;
