import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { IoSearch } from "react-icons/io5";

function GlobalSearch() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-zinc-700 text-zinc-100 h-8 rounded-md w-full flex items-center space-x-2 pl-2"
      >
        <IoSearch className="text-zinc-400" />
        <div className="w-full pr-2 py-1 rounded-md text-sm text-start outline-0 text-zinc-400 truncate">
          Search for tasks...
        </div>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          <CommandGroup>
            <CommandItem>Cal</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default GlobalSearch;
