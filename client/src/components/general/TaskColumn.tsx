"use client";

import { TStatus } from "@/types/ITask";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import React, { useState } from "react";
import TaskColumnOptions from "./TaskColumnOptions";
import { MdOutlineUnfoldMore } from "react-icons/md";

function TaskColumn({
  children,
  title,
  id,
}: {
  children: React.ReactNode;
  title: string;
  id: TStatus;
}) {
  const [folded, setFolded] = useState(false);

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
        "rounded-md p-1.5 border-2 border-dashed transition-all duration-300 ease-in-out",
        folded && !isOver ? "w-8 h-48 space-y-2" : "w-72 h-full space-y-2.5",
        isOver &&
          active?.data.current &&
          active?.data.current.currentStatus !== id
          ? "border-main bg-zinc-100/50"
          : "border-zinc-200"
      )}
    >
      {folded && !isOver ? (
        <>
          <button
            onClick={() => setFolded(false)}
            className="hover:bg-zinc-300 h-6 w-6 mt-1.5 flex justify-center items-center cursor-pointer rounded-full"
          >
            <MdOutlineUnfoldMore />
          </button>
          <h1 className="pb-2.5 rotate-90 text-nowrap text-zinc-900 font-semibold">
            {title}
          </h1>
        </>
      ) : (
        <>
          <h1 className="px-2.5 py-1 text-zinc-900 font-semibold flex items-center justify-between">
            <span>{title}</span>
            <TaskColumnOptions setFolded={setFolded} title={title} id={id} />
          </h1>
          {children}
        </>
      )}
    </div>
  );
}


export default TaskColumn;
