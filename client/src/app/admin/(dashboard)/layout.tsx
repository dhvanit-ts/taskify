import AdminSidebarBar from "@/components/helping/AdminSidebarBar";
import BoardSidebar from "@/components/layout/BoardSidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen h-screen flex bg-zinc-900">
      <AdminSidebarBar />
      <BoardSidebar />
      <div className="w-full h-full ml-2 flex items-center flex-col rounded-l-3xl bg-zinc-200">
        {children}
      </div>
    </div>
  );
}

export default layout;
