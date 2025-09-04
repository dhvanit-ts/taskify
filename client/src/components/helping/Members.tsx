"use client";

import React from "react";
import BoardForm from "../forms/BoardForm";
import { IoMdPersonAdd } from "react-icons/io";
import useBoardStore from "@/store/boardStore";
import { useParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AvatarWrapper from "../wrappers/AvatarWrapper";
import { Separator } from "../ui/separator";

const Members = () => {
  const [open, setOpen] = React.useState(false);
  const { boardId } = useParams<{ boardId: string }>();
  const boards = useBoardStore((s) => s.boards);

  const board = boards.find((b) => b._id === boardId);

  if (!board) return null;

  if (board?.members && board.members.length > 0)
    return (
      <>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
          <Tooltip>
            <TooltipTrigger>
              {board.members.map((member) => (
                <AvatarWrapper user={member} key={member._id} />
              ))}
            </TooltipTrigger>
            <TooltipContent className="p-1 bg-zinc-300 text-zinc-900 shadow-xl">
              <ul className="space-y-2">
                {board.members.map((member) => (
                  <li key={member._id} className="px-2 py-1 rounded flex">
                    <AvatarWrapper user={member} />
                    <div className="pl-2">
                      <h3 className="font-semibold">{member.username}</h3>
                      <p className="text-2xs text-zinc-700">{member.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Separator className="bg-zinc-400 my-1" />
              <button
                onClick={() => setOpen(true)}
                className="w-full flex justify-center items-center cursor-pointer space-x-2 px-2.5 py-1.5 hover:bg-zinc-200 rounded-md"
              >
                <IoMdPersonAdd className="text-sm" />
                <span className="text-sm font-semibold">Manage members</span>
              </button>
            </TooltipContent>
          </Tooltip>
        </div>
        <BoardForm
          openForm={open}
          setOpenForm={setOpen}
          showFields={["select-members"]}
          initialState={board}
          boardId={boardId}
        />
      </>
    );

  return (
    <BoardForm
      showFields={["select-members"]}
      initialState={board}
      boardId={boardId}
    >
      <button className="size-8 flex justify-center items-center transition-all text-zinc-700 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer rounded-full">
        <IoMdPersonAdd className="text-lg" />
      </button>
    </BoardForm>
  );
};

export default Members;
