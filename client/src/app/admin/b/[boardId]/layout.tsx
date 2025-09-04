"use client";

import React from "react";
import HeaderButtons from "@/components/general/HeaderButtons";
import TaskTabs from "@/components/helping/TaskTabs";
import BoardSidebar from "@/components/layout/BoardSidebar";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import { FaUsersCog } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const activeClasses = "bg-zinc-300 w-9";
const inactiveClasses = "hover:bg-zinc-300";

function BoardPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-h-screen h-screen flex bg-zinc-900">
      <div className="w-12 h-full pt-8 bg-zinc-800 space-y-2 pr-1.5 mr-1">
        <Tab
          href="/admin"
          className={
            !pathname.includes("/users") ? activeClasses : inactiveClasses
          }
        >
          <MdDashboard />
        </Tab>
        <Tab
          className={
            pathname.includes("/users") ? activeClasses : inactiveClasses
          }
          href="/admin/users"
        >
          <FaUsersCog />
        </Tab>
      </div>
      <BoardSidebar />
      <div className="w-full h-full ml-2 flex items-center flex-col rounded-l-3xl bg-zinc-200 p-2.5">
        <div className="mx-auto h-full w-full lg:w-[70rem] xl:w-[74rem]">
          <div className="w-full h-24 pb-6 flex justify-between items-center">
            <TaskTabs />
            <HeaderButtons />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

const Tab = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "p-2 w-8 h-10 hover:w-9 transition-all flex justify-center items-center bg-zinc-900 text-zinc-500 hover:bg-zinc-200 cursor-pointer rounded-r-md",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default BoardPage;
