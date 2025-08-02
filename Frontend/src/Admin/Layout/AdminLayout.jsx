import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <div className="flex h-screen min-h-screen w-full flex-col bg-gray-50">
      <Sidebar
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />
      <div className="flex flex-col md:ml-64 flex-1">
        <Header setIsMobileNavOpen={setIsMobileNavOpen} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
