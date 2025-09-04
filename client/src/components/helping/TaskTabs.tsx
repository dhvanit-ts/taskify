"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const activeClasses = "bg-zinc-800 text-zinc-300";
const inactiveClasses = "hover:bg-zinc-200";

function TaskTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Tasks",
      href: "/admin/b/[boardId]",
      classNames:
        !pathname.includes("analytics") && !pathname.includes("timeline")
          ? activeClasses
          : inactiveClasses,
    },
    {
      name: "Analytics",
      href: "/admin/b/[boardId]/analytics",
      classNames: pathname.includes("analytics")
        ? activeClasses
        : inactiveClasses,
    },
    {
      name: "Timeline",
      href: "/admin/b/[boardId]/timeline",
      classNames: pathname.includes("timeline")
        ? activeClasses
        : inactiveClasses,
    },
  ];

  return (
    <div className="flex items-center space-x-1.5 bg-zinc-300 rounded-full p-1">
      {tabs.map((tab) => (
        <Tab key={tab.name} href={tab.href} className={tab.classNames}>
          {tab.name}
        </Tab>
      ))}
    </div>
  );
}

const Tab = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const { boardId } = useParams();

  return (
    <Link
      href={href.replace("[boardId]", boardId?.toString() ?? "")}
      className={cn(
        "flex items-center text-sm space-x-1 py-1 px-3 cursor-pointer font-semibold transition-all rounded-full",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default TaskTabs;
