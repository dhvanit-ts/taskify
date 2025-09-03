import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetchBoard from "@/hooks/useFetchBoard";
import useBoardStore from "@/store/boardStore";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import BoardForm from "../forms/BoardForm";
import { FaPlus } from "react-icons/fa6";

function BoardNameList() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);

  const { boardId } = useParams();

  useFetchBoard(setBoards, setLoading);

  return (
    <>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger>
          <h1
            className={`flex justify-center items-center space-x-2 hover:bg-zinc-700 px-2 py-1 rounded-md cursor-pointer transition-all ${
              loading ? "cursor-not-allowed animate-pulse bg-zinc-300" : ""
            }`}
          >
            <span>
              {boards.find((board) => board._id === boardId)?.name || "loading"}
            </span>
            <IoIosArrowDown
              className={clsx(open ? "rotate-180" : "", "transition-all")}
            />
          </h1>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Boards</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {boards.length > 0 || !loading ? (
            boards.map((board) => (
              <DropdownMenuItem key={board._id} asChild>
                <Link className="cursor-pointer" href={`/admin/b/${board._id}`}>
                  {board.name}
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex justify-center items-center h-32 bg-zinc-100/60 rounded-md">
              <p className="text-xs text-zinc-400 flex flex-col justify-center items-center space-y-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Loading</span>
                  </>
                ) : (
                  "No boards found"
                )}
              </p>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenForm(true)}>
            <button className="w-full cursor-pointer rounded-md flex items-center space-x-1.5">
              <FaPlus className="text-xs" />
              <span className="text-sm">New Board</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BoardForm openForm={openForm} setOpenForm={setOpenForm} />
    </>
  );
}

export default BoardNameList;
