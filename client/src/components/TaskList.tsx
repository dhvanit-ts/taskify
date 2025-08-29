import useTodoStore from "@/store/taskStore";
import React from "react";
import TaskCard from "./TaskCard";
import { TStatus } from "@/types/ITask";

function TaskList({ status }: { status: TStatus }) {
  const todos = useTodoStore((s) => s.todos).filter(
    (todo) => todo.status === status
  );

  return (
    <>
      {todos.length > 0 ? (
        todos.map((todo) => <TaskCard key={todo._id} task={todo} />)
      ) : (
        <div className="flex justify-center items-center h-60 bg-zinc-100/60 rounded-md">
          <p className="text-xs text-zinc-400">Column is empty</p>
        </div>
      )}
    </>
  );
}

export default TaskList;
