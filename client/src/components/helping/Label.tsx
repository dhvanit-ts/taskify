import React from "react";

function Label({ label, htmlFor }: { label: string, htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-zinc-300 mb-2">
      {label}
    </label>
  );
}

export default Label;
