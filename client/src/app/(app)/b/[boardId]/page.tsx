"use client";

import BoardNameList from "@/components/BoardNameList";
import TaskColumn from "@/components/TaskColumn";
import TaskList from "@/components/TaskList";
import statusColumns from "@/constants/statusColumns";
import useTodoStore from "@/store/taskStore";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React from "react";
import { IoSearch } from "react-icons/io5";

function BoardPage() {
  const moveTodo = useTodoStore((s) => s.moveTodo);

  const handleDragStart = (e: DragStartEvent) => {
    // console.log(e);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (
      over?.data.current &&
      over?.data.current.id === active?.data.current?.currentStatus
    )
      return;
    moveTodo(active.data.current?.id, over?.data.current?.id);
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="max-h-screen h-screen space-y-2 p-4 bg-zinc-50">
      <div className="w-full h-10 rounded-md flex justify-between items-center bg-zinc-200 text-zinc-900 font-semibold px-3 py-1.5">
        <BoardNameList />
        <div className="bg-zinc-100 rounded-md flex items-center space-x-2 pl-2">
          <IoSearch className="text-zinc-400" />
          <input
            type="text"
            className="w-72 pr-2 py-1 rounded-md outline-0"
            placeholder="Search for tasks..."
          />
        </div>
        <div></div>
      </div>
      <div className="h-[calc(100%-3.25rem)] flex rounded-md bg-zinc-200 p-2.5">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          sensors={sensors}
        >
          <div className="mx-auto flex space-x-2.5">
            {statusColumns.map((status) => (
              <TaskColumn key={status.id} title={status.title} id={status.id}>
                <TaskList status={status.id} />
              </TaskColumn>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default BoardPage;
