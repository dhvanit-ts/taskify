import React from "react";
import HeaderButtons from "@/components/general/HeaderButtons";
import TaskTabs from "@/components/helping/TaskTabs";
import BoardSidebar from "@/components/layout/BoardSidebar";

function BoardPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen h-screen flex p-4 bg-zinc-900 space-x-2">
      <BoardSidebar />
      <div className="w-full h-full flex items-center flex-col rounded-3xl bg-zinc-200 p-2.5">
        <div className="mx-auto h-full w-full lg:w-[70rem] xl:w-[74rem]">
          <div className="w-full h-20 pb-4 flex justify-between items-center">
            <TaskTabs />
            <HeaderButtons />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
