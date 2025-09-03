"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import useHandleAuthError from "./useHandleAuthError";
import { IBoard } from "@/types/IBoard";
import axios, { AxiosError } from "axios";

function useFetchBoard(
  setBoards: (boards: IBoard[]) => void,
  setFetching: React.Dispatch<React.SetStateAction<boolean>>
) {
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

  return null;
}

export default useFetchBoard;
