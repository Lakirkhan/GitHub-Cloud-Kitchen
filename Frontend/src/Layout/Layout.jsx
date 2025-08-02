import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={1000} />
      <Navbar />
      <main className="main-layout min-h-[calc(100vh-270px-60px)] mt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
