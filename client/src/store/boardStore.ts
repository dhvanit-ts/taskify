import { IBoard } from "@/types/IBoard";
import { create } from "zustand";

interface BoardState {
  boards: IBoard[];
  addBoard: (board: IBoard) => void;
  removeBoard: (boardId: string) => void;
  setBoards: (boards: IBoard[]) => void;
}

const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  addBoard: (board: IBoard) =>
    set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (boardId: string) =>
    set((state) => ({
      boards: state.boards.filter((board) => board._id !== boardId),
    })),
  setBoards: (boards: IBoard[]) => set({ boards }),
}));

export default useBoardStore;
