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
import { FaPlus } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import TaskForm from "../forms/TaskForm";
import { MdOutlineUnfoldLess } from "react-icons/md";

const TaskColumnOptions = ({
  title,
  id,
  setFolded,
}: {
  title: string;
  id: TStatus;
  setFolded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex justify-center items-center space-x-1">
      <button
        onClick={() => setFolded(true)}
        className="hover:bg-zinc-300 h-6 w-6 flex justify-center items-center cursor-pointer rounded-full"
      >
        <MdOutlineUnfoldLess />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-zinc-300 h-6 w-6 flex justify-center items-center cursor-pointer rounded-full">
          <FiFilter className="text-sm" />
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
      <TaskForm defaultStatus={id}>
        <button className="hover:bg-zinc-300 h-6 w-6 flex justify-center items-center cursor-pointer rounded-full">
          <FaPlus className="text-sm" />
        </button>
      </TaskForm>
    </div>
  );
};

export default TaskColumnOptions;
