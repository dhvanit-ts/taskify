"use client"

import React from "react";
import TaskForm from "../forms/TaskForm";
import { FaPlus } from "react-icons/fa6";
import { usePathname } from "next/navigation";

function TaskFormWrapper() {
  const pathname = usePathname();

  if (!pathname.includes("/admin")) {
    return null;
  }

  return (
    <TaskForm>
      <button className="size-8 flex justify-center items-center transition-all text-zinc-700 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer rounded-full">
        <FaPlus className="text-lg" />
      </button>
    </TaskForm>
  );
}

export default TaskFormWrapper;
