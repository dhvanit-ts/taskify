"use client";

import BoardForm from "@/components/forms/BoardForm";
import useFetchBoard from "@/hooks/useFetchBoard";
import useBoardStore from "@/store/boardStore";
import { IBoard } from "@/types/IBoard";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

function AdminDashboard() {
  const [fetching, setFetching] = useState(false);

  const setBoards = useBoardStore((s) => s.setBoards);
  const boards = useBoardStore((s) => s.boards);

  useFetchBoard(setBoards, setFetching);

  return (
    <div className="h-screen w-screen bg-zinc-50">
      <div className="w-xl mx-auto flex flex-col py-24 px-4">
        <h2 className="text-2xl text-center pb-4">Boards</h2>
        <div>
          <div className="flex space-x-1 mx-auto w-96">
            <div className="bg-zinc-100 rounded-md flex items-center space-x-2 pl-2">
              <IoSearch className="text-zinc-400" />
              <input
                type="text"
                className="w-72 pr-2 py-1 rounded-md outline-0"
                placeholder="Search for tasks..."
              />
            </div>
            <BoardForm>
              <button className="p-2 bg-zinc-100 text-zinc-500 hover:bg-zinc-50 cursor-pointer rounded-md">
                <FaPlus />
              </button>
            </BoardForm>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-4">
          {fetching
            ? "Loading..."
            : boards.map((board) => (
                <BoardCard key={board._id} board={board} />
              ))}
          {!fetching && boards.length === 0 && "No boards"}
        </div>
      </div>
    </div>
  );
}

const BoardCard = ({ board }: { board: IBoard }) => {
  return (
    <Link
      href={`/admin/b/${board._id}`}
      className="bg-zinc-200 hover:bg-zinc-300 cursor-pointer rounded-md px-3 py-2"
    >
      <h3>{board.name}</h3>
      <p>{board.members.length ?? 0} members</p>
    </Link>
  );
};

export default AdminDashboard;
