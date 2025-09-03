import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TStatus } from "@/types/ITask";
import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const TaskColumnOptions = ({title, id}: {title: string, id: TStatus}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-zinc-300 p-1 cursor-pointer rounded-full">
        <HiDotsHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Change name</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskColumnOptions;
