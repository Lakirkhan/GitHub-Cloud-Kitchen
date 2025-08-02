import { useState } from "react";
import { Bell, House, Menu as MenuIcon } from "lucide-react";
import UserDropdown from "./UserDropDown";
import { Link } from "react-router-dom";

const Header = ({ setIsMobileNavOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 md:h-15">
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={() => setIsMobileNavOpen(true)}
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold flex-1">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 relative"><House /></Link>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
