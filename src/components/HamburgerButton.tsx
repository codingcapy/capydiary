"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { useNav } from "./NavContext";

export function HamburgerButton() {
  const { toggleNav } = useNav();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <button onClick={toggleNav} className="mr-5 md:hidden">
      <GiHamburgerMenu size={25} />
    </button>
  );
}
