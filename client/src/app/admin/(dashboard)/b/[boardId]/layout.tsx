import React from "react";
import HeaderButtons from "@/components/general/HeaderButtons";
import TaskTabs from "@/components/helping/TaskTabs";

function BoardPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-full p-2.5">
      <div className="w-full h-24 pb-6 space-x-12 flex justify-between items-center">
        <TaskTabs />
        <HeaderButtons />
      </div>
      {children}
    </div>
  );
}

export default BoardPage;
