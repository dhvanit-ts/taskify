"use client";

import { ITask } from "@/types/ITask";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";
import { CgDetailsMore } from "react-icons/cg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function TaskCard({ task }: { task: ITask }) {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: task._id,
      data: {
        id: task._id,
        currentStatus: task.status,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          className={clsx(
            "bg-zinc-100 text-zinc-900 shadow-lg w-full rounded-md overflow-hidden p-3 group/card border-2 border-zinc-100 hover:border-main transition-all duration-100 space-y-3",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          <div className="h-3 mb-2 flex items-center">
            <span
              className={clsx(
                "h-2 w-10 inline-block rounded-full",
                task.priority === "high" && "bg-red-400",
                task.priority === "medium" && "bg-amber-400",
                task.priority === "low" && "bg-green-400"
              )}
            ></span>
          </div>
          <h1 className="font-semibold text-start">{task.title}</h1>
          <div className="flex space-x-1">
            <span className="text-xs bg-amber-400 text-zinc-900 px-2 py-1 rounded-full">
              {task.dueDate.toLocaleDateString()}
            </span>
            <span className="font-semibold text-xs bg-green-500 text-zinc-900 aspect-square h-6 w-6 flex justify-center items-center rounded-full">
              {task.assignedTo.slice(0, 1).toUpperCase()}
            </span>
            <span className="text-xs bg-zinc-300 text-zinc-900 flex justify-center items-center px-2 py-1 rounded-full">
              <CgDetailsMore />
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default TaskCard;
