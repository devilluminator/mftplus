"use client";
import React, { useEffect, useState } from "react";
import useSocket from "@/lib/use-socket";
import { MessageSquareText, XSquareIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

function Footer() {
  // States
  const [Messages, setMessages] = useState<
    { message: string; sender: string }[]
  >([]);
  const [openChat, setOpenChat] = useState<boolean>(false);
  // Refs
  const messageRef = React.useRef<HTMLInputElement>(null);
  // Effect
  useEffect(() => {
    const socket = useSocket();
    socket?.on("connect", () => {
      console.log("Connected to server ");
    });
    socket?.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket?.on("chat-response", (data: { message: string; sender: string }) => {
      console.log(data);

      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("chat-response");
    };
  }, []);
  // functions
  const sendMessage = () => {
    if (!messageRef.current?.value) return;
    const socket = useSocket();
    socket?.emit("chat-message", {
      message: messageRef.current?.value,
      sender: "client",
    });
    messageRef.current.value = "";
  };

  return (
    <div className='relative flex flex-col justify-center items-center mt-auto text-sm md:text-base container'>
      <span className='opacity-0 min-h-[7rem] pointer-events-none'>
        SOME SPACE
      </span>
      <span className='flex justify-center items-center backdrop-blur-sm px-3 border rounded-md w-full min-h-24 text-pretty rtl'>
        دفتر مرکزی - لیانشمپو غربی، خیابان شهیید بروسلی، کوچه لپ چون کان، درب
        آخر، پلاک اژدها صورتی
      </span>
      <Button
        className='right-3 bottom-3 absolute flex justify-center items-center p-3 border-[3px] rounded-full w-12 h-12'
        onClick={() => setOpenChat(true)}>
        <MessageSquareText className='scale-150' />
      </Button>
      <motion.div
        className={cn(
          "right-0 bottom-0 absolute flex flex-col justify-between items-center bg-background p-3 border rounded-md  overflow-auto ",
          openChat
            ? "w-[93%] md:w-[25%] h-[45vh] opacity-1"
            : " w-0 h-0 opacity-0",
        )}>
        <p className='flex justify-between items-center py-3 border-b w-full'>
          <XSquareIcon
            className='top-1 left-1 absolute opacity-50 hover:opacity-100 hover:text-red-600 dark:text-red-300 cursor-pointer'
            onClick={() => setOpenChat(false)}
          />
          تیم پشتیبانی
          <span className='flex justify-center items-center gap-1'>
            Jennifer Lawrence
            <Image
              src='/jennifer-lawrence.webp'
              width={36}
              height={36}
              alt='jennifer-lawrence'
            />
          </span>
        </p>
        <span className='flex flex-col justify-start items-start size-full scroll-auto'>
          {Messages.map(
            (message, index) =>
              message && (
                <span
                  key={index + "_message"}
                  className={cn(
                    "flex items-start p-3 border-b w-full",
                    message.sender === "client"
                      ? "justify-end"
                      : "justify-start",
                  )}>
                  {message.message}
                </span>
              ),
          )}
        </span>
        <Input
          ref={messageRef}
          className='px-3 min-h-12 rtl'
          placeholder='سوال و یا مشکل خود را مطرح کنید'
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === "Enter" && sendMessage()
          }
        />
      </motion.div>
    </div>
  );
}

export default Footer;
