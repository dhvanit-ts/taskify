import React from "react";
import { Separator } from "../ui/separator";

function OrSeparator() {
  return (
    <div className="flex justify-center items-center my-3 text-xs">
      <Separator className="shrink bg-zinc-500" />
      <span className="px-4 text-zinc-500 dark:text-zinc-500 text-xs">Or</span>
      <Separator className="shrink bg-zinc-500" />
    </div>
  );
}

export default OrSeparator;
