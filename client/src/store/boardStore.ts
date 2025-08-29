import { IBoard } from "@/types/IBoard";
import { create } from "zustand";

interface BoardState {
  boards: IBoard[];
  addBoard: (board: IBoard) => void;
  setBoard: (boards: IBoard[]) => void;
}

const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  addBoard: (board: IBoard) => set((state) => ({ boards: [...state.boards, board] })),
  setBoard: (boards: IBoard[]) => set({ boards }),
}));

export default useBoardStore;
