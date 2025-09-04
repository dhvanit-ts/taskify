import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import TaskForm from "../forms/TaskForm";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Members from "../helping/Members";

const HeaderButtons = () => {
  return (
    <div className="flex items-center h-fit space-x-2 p-1rounded-full">
      <div className="flex items-center h-fit space-x-1 p-1 bg-zinc-300 rounded-full">
        <Members />
      </div>
      <div className="flex items-center h-fit space-x-1 p-1 bg-zinc-300 rounded-full">
        <div className="flex bg-zinc-200 rounded-full">
          <TaskForm>
            <button className="size-8 flex justify-center items-center transition-all text-zinc-700 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer rounded-full">
              <FaPlus className="text-lg" />
            </button>
          </TaskForm>
          <Notifications>
            <button className="size-8 flex justify-center items-center transition-all text-zinc-700 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer rounded-full">
              <IoIosNotifications className="text-xl" />
            </button>
          </Notifications>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default HeaderButtons;
