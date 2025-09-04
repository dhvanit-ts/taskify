import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function Notifications({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <p>Notifications</p>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
