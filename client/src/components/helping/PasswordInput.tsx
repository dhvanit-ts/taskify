"use client";

import React from "react";
import { Input } from "../ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordInput({ ...props }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        className="border-zinc-800 bg-zinc-800"
        type={show ? "text" : "password"}
        {...props}
      />
      <button
        type="button"
        className="absolute cursor-pointer top-3 right-4"
        onClick={() => setShow(!show)}
      >
        {!show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default PasswordInput;
