// react forwardRef a span element
import { cn } from "@/lib/utils";
import React from "react";

interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  orientation: "horizontal" | "vertical";
}

const Separator = React.forwardRef<HTMLSpanElement, SpanProps>(
  ({ orientation, className, ...props }, ref) => {
    return (
      <span
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Separator;
