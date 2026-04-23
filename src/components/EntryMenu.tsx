"use client";

import { useEffect, useRef, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

export function EntryMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer p-1"
        aria-label="Entry options"
      >
        <FaEllipsis />
      </button>
      {open && (
        <div className="absolute top-8 right-0 px-5 py-2 shadow-[0_0_15px_rgba(0,0,0,0.7)] z-40 bg-zinc-800 rounded">
          <div className="py-2 flex">
            <FaRegBookmark size={20} className="pt-1" />
            <div className="ml-1 cursor-pointer">Edit</div>
          </div>
          <div className="py-2 flex cursor-pointer text-red-400">
            <FaRegTrashAlt size={20} className="pt-1" />
            <div className="ml-1">Delete</div>
          </div>
        </div>
      )}
    </div>
  );
}
