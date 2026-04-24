"use client";

import { useNav } from "./NavContext";

export function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  const { isNavOpen, closeNav } = useNav();

  return (
    <>
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeNav}
        />
      )}
      <div className={isNavOpen ? "block" : "hidden md:block"}>{children}</div>
    </>
  );
}
