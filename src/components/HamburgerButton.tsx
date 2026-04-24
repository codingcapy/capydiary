"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { useNav } from "./NavContext";

export function HamburgerButton() {
  const { toggleNav } = useNav();

  return (
    <button onClick={toggleNav} className="mr-5 md:hidden">
      <GiHamburgerMenu size={25} />
    </button>
  );
}
