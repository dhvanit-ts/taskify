import { IUser } from "@/types/IUser";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AvatarWrapper({ user }: { user: IUser }) {
  return (
    <Avatar key={user._id}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>
        {user.username?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarWrapper;
