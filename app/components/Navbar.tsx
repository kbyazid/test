"use client";
import Link from "next/link";
import {  useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  /* const user = "tlemcencrma20@gmail.com"; */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleTheme = () => {
    const html = document.querySelector("html");
    if (html) {
         const currentTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", currentTheme === "dark" ? "cupcake" : "dark");
    }
 
  };

  return (
    <div className="bg-base-200/30 px-5 md:px-[10%] py-4 relative">
      {((
          <>
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex text-2xl items-center font-bold">
                <Link href={"/"}>
                  e <span className="text-accent">.Tres</span>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="flex items-center space-x-4">
                {/* quand l ecran est plus grand on l affiche , on le cache qu on c est petit  */}
                <div className="md:flex hidden space-x-2">

                  <Link href={"/users"} className="btn btn-sm">
                    Mes users
                  </Link>
                  <Link href={"/budget"} className="btn btn-sm">
                    Mes budjets
                  </Link>
                  <Link href={"/dashboard"} className="btn btn-sm">
                    Tableau de bord
                  </Link>
                  <Link href={"/transaction"} className="btn btn-sm">
                    Mes Transactions
                  </Link>
                  <Link href={"/test"} className="btn btn-sm">
                    Test Tr
                  </Link>
                </div>
                <div className="md:flex hidden space-x-2">
                 
                  {/* Theme toggle */}
                  <div className="flex-none">
                  <label className="swap swap-rotate cursor-pointer transition-transform hover:scale-125">
                    <input onClick={toggleTheme} type="checkbox" />
                    <svg
                      className="swap-on h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    <svg
                      className="swap-off h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                  </label>
                  </div> 

                  {/* <UserButton /> */}
                </div>
 
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex justify-between items-center space-x-2">
                <button onClick={toggleMenu}>
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                
                <div className="flex-none">
                  <label className="swap swap-rotate cursor-pointer transition-transform hover:scale-125">
                    <input onClick={toggleTheme} type="checkbox" />
                    <svg
                      className="swap-on h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    <svg
                      className="swap-off h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                  </label>
                </div> 
                {/* <UserButton /> */}
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-2 flex flex-col items-center bg-base-100 rounded-lg shadow p-4 space-y-2 z-10 absolute top-full left-0 right-0 mx-5">
                <Link
                  href={"/users"}
                  className="btn btn-sm w-full"
                  onClick={toggleMenu}
                >
                  Mes users
                </Link>
                <Link
                  href={"/budget"}
                  className="btn btn-sm w-full"
                  onClick={toggleMenu}
                >
                  Mes budjets
                </Link>
                <Link
                  href={"/dashboard"}
                  className="btn btn-sm w-full"
                  onClick={toggleMenu}
                >
                  Tableau de bord
                </Link>
                <Link
                  href={"/transaction"}
                  className="btn btn-sm w-full"
                  onClick={toggleMenu}
                >
                  Mes Transactions
                </Link>
                <Link
                  href={"/test"}
                  className="btn btn-sm w-full"
                  onClick={toggleMenu}
                >
                  Test Tr
                </Link>
              </div>
            )}
          </>
        ) 
/*          (
          <div className="flex items-center justify-between">
            <div className="flex text-2xl items-center font-bold">
              e <span className="text-accent">.Track</span>
            </div>   
          </div>
        ) */
        )}
    </div>
  );
};

export default Navbar;