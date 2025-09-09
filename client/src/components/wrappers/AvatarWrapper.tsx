import { IUser } from "@/types/IUser";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AvatarWrapper({ user }: { user: IUser }) {
  return (
    // <Avatar key={user._id}>
    //   <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    //   <AvatarFallback>
    //     {user.username?.slice(0, 2).toUpperCase()}
    //   </AvatarFallback>
    // </Avatar>
    <div className="w-7 h-7 bg-zinc-300 text-zinc-900 font-semibold rounded-full flex justify-center items-center">{user.username?.slice(0, 2).toUpperCase()}</div>
  );
}

export default AvatarWrapper;
