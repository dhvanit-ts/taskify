import { ITask } from "@/types/ITask";
import { TStatus } from "@/types/ITask";
import { create } from "zustand";

const mockTodos: ITask[] = [
  {
    _id: "1",
    title: "Todo 1",
    description: "",
    priority: "high",
    status: "to-do",
    dueDate: new Date(),
    assignedTo: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    title: "Todo 2",
    description: "",
    priority: "medium",
    status: "in-progress",
    dueDate: new Date(),
    assignedTo: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    title: "Todo 3",
    priority: "low",
    description: "",
    status: "in-progress",
    dueDate: new Date(),
    assignedTo: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface TodoState {
  todos: ITask[];
  addTodo: (todo: ITask) => void;
  setTodos: (todos: ITask[]) => void;
  removeTodo: (id: string) => void;
  moveTodo: (id: string, status: TStatus) => void;
}

const useTodoStore = create<TodoState>((set) => ({
  todos: mockTodos,
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
  removeTodo: (id: string) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo._id !== id) })),
}));

export default useTodoStore;
