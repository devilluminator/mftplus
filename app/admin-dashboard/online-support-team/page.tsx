"use client";
import React, { useEffect, useState } from "react";
import useSocket from "@/lib/use-socket";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function OnlineChat() {
  // States
  const [Messages, setMessages] = useState<
    { message: string; sender: string }[]
  >([]);
  // Refs
  const messageRef = React.useRef<HTMLInputElement>(null);
  // Effect
  useEffect(() => {
    const socket = useSocket();
    socket?.on("chat-response", (data: { message: string; sender: string }) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket?.off("chat-response");
    };
  }, []);
  // functions
  const sendMessage = () => {
    if (!messageRef.current?.value) return;
    const socket = useSocket();
    socket?.emit("chat-message", {
      message: messageRef.current?.value,
      sender: "server",
    });
    messageRef.current.value = "";
  };

  return (
    <div className='flex flex-col justify-start items-start gap-1 bg-background p-3 border rounded-md w-full min-h-[60vh] rtl'>
      <span className='p-3 border-b w-full'>پاسخگویی به کاربران</span>
      <span className="className='flex flex-col justify-start items-start h-[45vh] size-full scroll-auto">
        {Messages.map(
          (message, index) =>
            message && (
              <span
                key={index + "_message"}
                className={cn(
                  "flex items-start p-3 border-b w-full",
                  message.sender === "client" ? "justify-start" : "justify-end",
                )}>
                {message.message}
              </span>
            ),
        )}
      </span>
      <Input
        ref={messageRef}
        className='min-h-12'
        placeholder='سنگین باش جنیفر جواب هر کسیو نده'
        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
          event.key === "Enter" && sendMessage()
        }
      />
    </div>
  );
}

export default OnlineChat;
