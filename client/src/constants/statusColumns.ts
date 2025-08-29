import { TStatus } from "@/types/ITask";

type TStatusColumn = {
    id: TStatus;
    title: string;
}

const statusColumns: TStatusColumn[] = [
  {
    id: "to-do",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

export default statusColumns