import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

function Profile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <p>Profile</p>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
