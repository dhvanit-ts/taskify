"use client";

import useHandleAuthError from "@/hooks/useHandleAuthError";
import useBoardStore from "@/store/boardStore";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function AdminDashboard() {
  const [fetching, setFetching] = useState(false);

  const setBoards = useBoardStore((s) => s.setBoards);
  const boards = useBoardStore((s) => s.boards);

  const { handleAuthError } = useHandleAuthError();

  const fetchBoards = useCallback(async () => {
    try {
      setFetching(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/all`,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch boards");
      }

      setBoards(response.data.data);
    } catch (error) {
      handleAuthError(error as AxiosError);
      console.log(error);
      toast.error("Failed to fetch boards");
    } finally {
      setFetching(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoards]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div>
      <h2>Admin</h2>
      {fetching
        ? "Loading..."
        : boards.map((board) => <div key={board._id}>{board.name}</div>)}
      {!fetching && boards.length === 0 && "No boards"}
    </div>
  );
}

export default AdminDashboard;
