import useFetchBoard from "@/hooks/useFetchBoard";
import useBoardStore from "@/store/boardStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import BoardForm from "../forms/BoardForm";
import { HiDotsHorizontal } from "react-icons/hi";

function Boards() {
  const [loading, setLoading] = useState(true);

  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);

  const { boardId } = useParams();

  useFetchBoard(setBoards, setLoading);

  return (
    <div className="flex flex-col space-y-1">
      {boards.length > 0 || !loading ? (
        boards.map((board) => (
          <Link
            key={board._id}
            className={`cursor-pointer py-1 px-3 group/board flex justify-between items-center hover:bg-zinc-800 rounded-md ${
              boardId === board._id && "bg-zinc-800"
            }`}
            href={`/admin/b/${board._id}`}
          >
            <span>{board.name}</span>
            <BoardForm>
              <button className="size-6 opacity-0 group-hover/board:opacity-100 flex justify-center items-center hover:bg-zinc-700 hover:text-zinc-100 text-zinc-400 cursor-pointer rounded-full">
                <HiDotsHorizontal />
              </button>
            </BoardForm>
          </Link>
        ))
      ) : loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-32 bg-zinc-700 mt-1 rounded-md" />
        ))
      ) : (
        <div className="flex justify-center items-center h-32 bg-zinc-100/60 rounded-md">
          <p className="text-xs text-zinc-400 flex flex-col justify-center items-center space-y-2">
            No boards found
          </p>
        </div>
      )}
    </div>
  );
}

export default Boards;
