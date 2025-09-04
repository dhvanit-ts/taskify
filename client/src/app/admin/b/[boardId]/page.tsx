"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import useTodoStore from "@/store/taskStore";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import statusColumns from "@/constants/statusColumns";
import TaskColumn from "@/components/general/TaskColumn";
import { TaskListSkeleton } from "@/components/skeletons/TaskCardSkeleton";
import TaskList from "@/components/general/TaskList";

function TasksPage() {
  const [loading, setLoading] = useState(true);

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
      setLoading(true);

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

      setTodos(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex space-x-2.5">
        {statusColumns.map((status) => (
          <TaskColumn key={status.id} title={status.title} id={status.id}>
            {loading ? (
              <TaskListSkeleton length={3} />
            ) : (
              <TaskList status={status.id} />
            )}
          </TaskColumn>
        ))}
      </div>
    </DndContext>
  );
}

export default TasksPage;
