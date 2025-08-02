import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <img
          src="/placeholder-user.jpg"
          alt="User"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <Link to="/admin/profile">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </button>
          </Link>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Settings
          </button>
          <div className="border-t my-1"></div>
          <Link to="/logout">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
