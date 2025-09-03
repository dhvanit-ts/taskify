import { ITask } from "@/types/ITask";
import { TStatus } from "@/types/ITask";
import { create } from "zustand";

interface TodoState {
  todos: ITask[];
  addTodo: (todo: ITask) => void;
  setTodos: (todos: ITask[]) => void;
  removeTodo: (id: string) => void;
  moveTodo: (id: string, status: TStatus) => void;
  updateTodo: (id: string, todo: ITask) => void;
}

const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (todo: ITask) => set((state) => ({ todos: [...state.todos, todo] })),
  setTodos: (todos: ITask[]) => set({ todos }),
  moveTodo: (id, status) =>
    set((state) => {
      const todo = state.todos.find((todo) => todo._id === id);
      if (todo) {
        todo.status = status;
        const todos = state.todos.filter((todo) => todo._id !== id);
        todos.push(todo);
        return { todos };
      } else {
        return { todos: state.todos };
      }
    }),
  updateTodo: (id, todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (todo._id === id ? todo : t)),
    })),
  removeTodo: (id: string) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo._id !== id) })),
}));

export default useTodoStore;
