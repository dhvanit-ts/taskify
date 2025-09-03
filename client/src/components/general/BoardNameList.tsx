import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useBoardStore from "@/store/boardStore";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function BoardNameList() {
  const [open, setOpen] = useState(false);
  const boards = useBoardStore((state) => state.boards);

  const { boardId } = useParams();

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}   >
      <DropdownMenuTrigger>
        <h1 className="flex justify-center items-center space-x-2 hover:bg-zinc-300 px-2 py-1 rounded-md cursor-pointer transition-all">
          <span>
            {boards.find((board) => board._id === boardId)?.name || "Board"}
          </span>
          <IoIosArrowDown className={clsx(open ? "rotate-180" : "", "transition-all")} />
        </h1>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {boards.length > 0 ? (
          boards.map((board) => (
            <DropdownMenuItem key={board._id}>{board.name}</DropdownMenuItem>
          ))
        ) : (
          <div className="flex justify-center items-center h-32 bg-zinc-100/60 rounded-md">
            <p className="text-xs text-zinc-400">No Boards</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BoardNameList;
