"use client";

import React from "react";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import { FaUsersCog } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const activeClasses = "bg-zinc-300 w-9";
const inactiveClasses = "hover:bg-zinc-300";

function AdminSidebarBar() {
  const pathname = usePathname();
  return (
    <div className="w-12 h-full pt-8 bg-zinc-800 space-y-2 pr-1.5 mr-1">
      <Tab
        href="/admin"
        tooltip="Dashboard"
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
        tooltip="Users"
      >
        <FaUsersCog />
      </Tab>
    </div>
  );
}

const Tab = ({
  href,
  className,
  children,
  tooltip,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  tooltip: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={href}
          className={cn(
            "p-2 w-8 h-10 hover:w-9 transition-all flex justify-center items-center bg-zinc-900 text-zinc-500 hover:bg-zinc-200 cursor-pointer rounded-r-md",
            className
          )}
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-zinc-300 text-zinc-900">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AdminSidebarBar;
