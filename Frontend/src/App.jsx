import { useState } from "react";
// import "./Vendors/VendorPanel.css";
import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryMenu from "./pages/Category_menu";
import AdminLayout from "./Admin/Layout/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import { CustomersPage } from "./Admin/pages/Customers";
import { MenuItemsPage } from "./Admin/pages/MenuItems";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import ProtectedRoute from "./Admin/components/ProtectedRoute";
import Logout from "./component/Logout";
import { ProfilePage } from "./Admin/pages/Profile";
import MenuItemDetails from "./pages/MenuItemDetails ";
import VendorRegister from "./Vendors/pages/VendorRegister";
import VendorLogin from "./Vendors/pages/VendorLogin";
import AdminLogin from "./Admin/pages/AdminLogin";
import { VendorPanel } from "./Vendors/vendor-panel";
import NotFound from "./pages/NotFound";
import Vendors_items from "./component/menu/Vendors_items";
import OrderPage from "./Admin/pages/Orders";
import Inventory from "./Admin/pages/Inventory";
import VendorForgotPassword from "./pages/VendorForgotPassword";
import VendorsPage from "./Admin/pages/Vendors";
import CategoryPage from "./Admin/pages/category";
import AnalyticsPage from "./Admin/pages/Analystics";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Main routes for public pages */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/unauthorized" element={<>You are unauthorized</>} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/vendors/:id" element={<Vendors_items />} />
            <Route path="/menu/:id" element={<CategoryMenu />} />
            <Route path="/menu/item/:itemId" element={<MenuItemDetails />} />
            <Route path="/cart" element={<Cart />} />
            {/* <Route path="/vendor-login" element={<VendorLogin />} /> */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/vendor-forgot-password"
              element={<VendorForgotPassword />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/vendor-register" element={<VendorRegister />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Routes for Admin, protected by ProtectedRoute */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderPage />} />
              <Route path="category" element={<CategoryPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="menu-items" element={<MenuItemsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Routes for Vendor, protected by ProtectedRoute */}
          <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
            <Route path="/vendor" element={<VendorPanel />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cart" element={<Cart/>} />
          </Route>

          {/* Catch-all redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
