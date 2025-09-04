import useFetchBoard from "@/hooks/useFetchBoard";
import useBoardStore from "@/store/boardStore";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function Boards() {
  const [loading, setLoading] = useState(false);

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
            className={`cursor-pointer py-1 px-3 hover:bg-zinc-800 rounded-md ${
              boardId === board._id && "bg-zinc-800"
            }`}
            href={`/admin/b/${board._id}`}
          >
            {board.name}
          </Link>
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
    </div>
  );
}

export default Boards;
