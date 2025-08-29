"use client";

import { TStatus } from "@/types/ITask";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import React from "react";
import TaskColumnOptions from "./TaskColumnOptions";

function TaskColumn({
  children,
  title,
  id,
}: {
  children: React.ReactNode;
  title: string;
  id: TStatus;
}) {
  const { isOver, setNodeRef, active } = useDroppable({
    id: title,
    data: {
      type: title,
      id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "w-72 h-full rounded-md p-1.5 space-y-2.5 border-2 border-dashed transition-all duration-100",
        isOver &&
          active?.data.current &&
          active?.data.current.currentStatus !== id
          ? "border-main bg-zinc-100/50"
          : "border-zinc-200"
      )}
    >
      <h1 className="px-2.5 py-1 text-zinc-900 font-semibold flex items-center justify-between">
        <span>{title}</span>
        <TaskColumnOptions title={title} id={id}/>
      </h1>
      {children}
    </div>
  );
}

export default TaskColumn;
