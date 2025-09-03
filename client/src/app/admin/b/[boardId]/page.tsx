"use client";

import BoardNameList from "@/components/general/BoardNameList";
import TaskColumn from "@/components/general/TaskColumn";
import TaskList from "@/components/general/TaskList";
import statusColumns from "@/constants/statusColumns";
import useTodoStore from "@/store/taskStore";
import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  Over,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import TaskForm from "@/components/forms/TaskForm";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { useParams } from "next/navigation";

function BoardPage() {
  const moveTodo = useTodoStore((s) => s.moveTodo);
  const setTodos = useTodoStore((s) => s.setTodos);
  const todos = useTodoStore((s) => s.todos);

  const { boardId } = useParams<{ boardId: string }>();

  const handleDragEndApi = async (active: Active, over: Over) => {
    try {
      const activeId = active?.data.current?.id;
      const overId = over?.data.current?.id;
      const todo = todos.find((todo) => todo._id === activeId);
      if (activeId && overId) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/update/${activeId}`,
          {
            title: todo?.title,
            description: todo?.description,
            priority: todo?.priority,
            status: over?.data.current?.id,
          },
          { withCredentials: true }
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const fetchTodos = useCallback(async () => {
    try {
      if (!boardId) return;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/board/${boardId}`,
        {
          withCredentials: true,
        }
      );

      if (res.status !== 200) {
        toast.error("Failed to fetch tasks");
        return;
      }

      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [boardId, setTodos]);

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (
      over?.data.current &&
      over?.data.current.id === active?.data.current?.currentStatus
    )
      return;

    const activeId = active.data.current?.id;
    moveTodo(activeId, over?.data.current?.id);
    const success = await handleDragEndApi(active, over);
    if (!success) moveTodo(activeId, active?.data.current?.currentStatus);
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="max-h-screen h-screen space-y-2 p-4 bg-zinc-50">
      <div className="w-full h-10 rounded-md flex justify-between items-center bg-zinc-200 text-zinc-900 font-semibold px-3 py-1.5">
        <BoardNameList />
        <div className="flex space-x-1">
          <div className="bg-zinc-100 rounded-md flex items-center space-x-2 pl-2">
            <IoSearch className="text-zinc-400" />
            <input
              type="text"
              className="w-72 pr-2 py-1 rounded-md outline-0"
              placeholder="Search for tasks..."
            />
          </div>
          <TaskForm>
            <button className="p-2 bg-zinc-100 text-zinc-500 hover:bg-zinc-50 cursor-pointer rounded-md">
              <FaPlus />
            </button>
          </TaskForm>
        </div>
        <div></div>
      </div>
      <div className="h-[calc(100%-3.25rem)] flex rounded-md bg-zinc-200 p-2.5">
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          sensors={sensors}
          modifiers={[restrictToWindowEdges]}
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
