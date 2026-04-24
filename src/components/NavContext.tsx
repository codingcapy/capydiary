"use client";

import { createContext, useContext, useState } from "react";

type NavContextType = {
  isNavOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
};

const NavContext = createContext<NavContextType>({
  isNavOpen: false,
  toggleNav: () => {},
  closeNav: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const closeNav = () => setIsNavOpen(false);

  return (
    <NavContext.Provider value={{ isNavOpen, toggleNav, closeNav }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
