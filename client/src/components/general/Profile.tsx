import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

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
        <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogContent></DialogContent>
        </DialogHeader>
        <p>Profile</p>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
