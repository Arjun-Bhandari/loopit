"use client";
import Link from "next/link";
import UploadExample from "./FileUpload";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User ,PanelLeftDashed } from "lucide-react";
import { useState, useEffect, ReactElement } from "react";
export function Sidebar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: any) => {
    if (!e.target.closest(".dropdown-container")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-2"
          className="btn drawer-button lg:hidden"
        >
          <PanelLeftDashed />
        </label>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div className="flex  items-center">
            <h1 className="font-bold text-2xl text-cyan-300">Loopit</h1>
          </div>
          {/* Sidebar content here */}
          <li className="text-lg">
            <Link href="/">Home</Link>
          </li>
          <li className="text-lg">
            <Link href="/reels">Reels</Link>
          </li>
          <li className="text-lg">
            <Link href="/create">Create</Link>
          </li>

          {session ? (
            <div className="dropdown-container relative">
              <div
                onClick={toggleDropdown}
                className="avatar flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-300 transition-all duration-200"
              >
                <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Profile"
                  />
                </div>
                <h1 className="font-mono text-lg">{session.user.email}</h1>
              </div>

              {/* Dropdown Menu */}
              <div
                className={`
                  absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-base-200 
                  transform transition-all duration-200 ease-in-out origin-top
                  ${
                    isOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                `}
              >
                <div
                  className="py-1 space-y-1"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-base-300 gap-2 transition-colors duration-200"
                    role="menuitem"
                    onClick={() => {
                      handleSignout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-base-300 gap-2 transition-colors duration-200"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={16} />
                    <span><Link href="/profile">Profile</Link></span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              className="text-black rounded-xl bg-cyan-400 border-2 px-4 py-2"
              href="/register"
            >
              Signin
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}
