"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const IconInput = React.forwardRef(
  (
    {
      className,
      icon: Icon,
      iconClassName,
      rightSlot,
      rightSlotClassName,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", wrapperClassName)}>
        {Icon ? (
          <Icon
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground",
              iconClassName
            )}
          />
        ) : null}
        <Input
          ref={ref}
          className={cn(Icon && "pl-10", rightSlot && "pr-11", className)}
          {...props}
        />
        {rightSlot ? (
          <div
            className={cn(
              "absolute right-2 top-1/2 z-10 -translate-y-1/2",
              rightSlotClassName
            )}
          >
            {rightSlot}
          </div>
        ) : null}
      </div>
    );
  }
);

IconInput.displayName = "IconInput";

export { IconInput };
