"use client";

import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useParams, usePathname } from "next/navigation";
import BoardForm from "@/components/forms/BoardForm";
import Boards from "@/components/general/Boards";
import useBoardStore from "@/store/boardStore";
import BoardOptions from "../helping/BoardOptions";
import GlobalSearch from "../general/GlobalSearch";

const BoardSidebar = () => {
  const boards = useBoardStore((s) => s.boards);
  const pathname = usePathname();
  const { boardId } = useParams<{ boardId: string }>();

  useEffect(() => {
    document.title = boards.find((b) => b._id === boardId)?.name ?? "Tasks";
  }, [boardId, boards]);

  return (
    <div className={`${pathname.includes("users") ? "w-0" : "w-72 px-3"} overflow-hidden transition-all h-full rounded-md group/sidebar flex flex-col space-y-4 text-zinc-200 font-semibold py-8`}>
      <h3 className="flex justify-between items-center w-full">
        <span className="text-2xl">
          {boards.find((b) => b._id === boardId)?.name ?? "Boards"}
        </span>
        <BoardOptions />
      </h3>
      <div className="flex space-x-1 pb-4">
        <GlobalSearch />
        <BoardForm>
          <button className="p-2 h-8 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 cursor-pointer rounded-md">
            <FaPlus />
          </button>
        </BoardForm>
      </div>
      <Boards />
    </div>
  );
};

export default BoardSidebar;
