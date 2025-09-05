"use client";

import BoardForm from "@/components/forms/BoardForm";
import GlobalSearch from "@/components/general/GlobalSearch";
import { Skeleton } from "@/components/ui/skeleton";
import TimelineWrapper from "@/components/wrappers/TimelineWrapper";
import useFetchBoard from "@/hooks/useFetchBoard";
import useBoardStore from "@/store/boardStore";
import { IBoard } from "@/types/IBoard";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

function AdminDashboard() {
  const [fetching, setFetching] = useState(true);

  const setBoards = useBoardStore((s) => s.setBoards);
  const boards = useBoardStore((s) => s.boards);

  useFetchBoard(setBoards, setFetching);

  return (
    <div className="px-4 max-h-screen w-full scroll-thin overflow-y-auto">
      <div className="flex justify-center items-center">
        <div className="py-24 w-xl flex flex-col">
          <h2 className="text-2xl text-center pb-4">Dashboard</h2>
          <div>
            <div className="flex mx-auto w-96">
              <GlobalSearch className="rounded-l-full h-10 px-3" />
              <div className="h-10 w-12 flex justify-center items-center bg-zinc-700 rounded-r-full">
                <BoardForm>
                  <button className="h-8 w-8 flex justify-center items-center bg-zinc-300 text-zinc-900 hover:bg-zinc-200 cursor-pointer rounded-full">
                    <FaPlus />
                  </button>
                </BoardForm>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <h3 className="text-xl py-6">Recent Activity</h3>
            <TimelineWrapper />
          </div>
          <h3 className="text-xl py-6">Boards</h3>
          <div className="grid grid-cols-2 gap-2">
            {fetching
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="shadow-xl p-2">
                    <Skeleton className="h-5 w-36 bg-zinc-400 mt-1 rounded-md" />
                    <Skeleton className="h-4 w-28 bg-zinc-400 mt-1 rounded-md" />
                  </Skeleton>
                ))
              : boards.map((board) => (
                  <BoardCard key={board._id} board={board} />
                ))}
            {!fetching && boards.length === 0 && "No boards"}
          </div>
        </div>
      </div>
    </div>
  );
}

const BoardCard = ({ board }: { board: IBoard }) => {
  return (
    <Link
      href={`/admin/b/${board._id}`}
      className="bg-zinc-100 hover:bg-zinc-100/60 group/board relative shadow-2xl transition-all cursor-pointer rounded-md px-3 py-2"
    >
      <h3 className="font-semibold">{board.name}</h3>
      <p className="text-2xs text-zinc-600">
        {board.members.length ?? 0} members
      </p>
      <BoardForm>
        <button onClick={(e) => e.stopPropagation()} className="size-6 absolute top-2 right-2 opacity-0 group-hover/board:opacity-100 flex justify-center items-center hover:bg-zinc-700 hover:text-zinc-100 text-zinc-400 cursor-pointer rounded-full">
          <HiDotsHorizontal />
        </button>
      </BoardForm>
    </Link>
  );
};

export default AdminDashboard;
