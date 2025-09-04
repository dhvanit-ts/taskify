import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import BoardForm from "../forms/BoardForm";
import { HiDotsHorizontal } from "react-icons/hi";
import useBoardStore from "@/store/boardStore";
import { useParams } from "next/navigation";
import { IoIosSettings } from "react-icons/io";

function BoardOptions() {
  const [open, setOpen] = React.useState(false);
  const boards = useBoardStore((s) => s.boards);
  const { boardId } = useParams<{ boardId: string }>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 text-base opacity-0 group-hover/sidebar:opacity-100 transition-all hover:bg-zinc-800 text-zinc-100 cursor-pointer rounded-full">
            <HiDotsHorizontal />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Board</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="flex gap-1.5"
          >
            <>
              <IoIosSettings />
              <span>Board settings</span>
            </>
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BoardForm boardId={boardId} openForm={open} setOpenForm={setOpen} initialState={boards.find((b) => b._id === boardId)} />
    </>
  );
}

export default BoardOptions;
