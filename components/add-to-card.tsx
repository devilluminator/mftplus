"use client";
import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

function AddToCard() {
  return (
    <Button
      className='mt-3 w-full font-bold'
      type='button'
      onClick={() =>
        toast.success("به سبد خرید شما اضافه شد", {
          position: "top-right",
          className: "rtl flex justify-start items-center gap-3",
        })
      }>
      افزودن به سبد خرید
    </Button>
  );
}

export default AddToCard;
