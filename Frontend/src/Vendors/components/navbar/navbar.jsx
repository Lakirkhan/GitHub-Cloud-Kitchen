import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/auth/authActions";
import { fetchVendorOrders } from "../../Services/vendorOrders";
import { vendorProfile } from "../../Services/VendorPopular";

export function Navbar({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handlechnage = () => {
    console.log("Profile clicked");
    navigate("/vendor", { replace: true });
  };

  const vendorId = useSelector((state) => state.auth.id);
  console.log("Vendor ID from Redux:", vendorId);

  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetchVendorOrders(vendorId)
      .then((response) => {
        console.log("Response for order history vendor:- ", response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.log("Error fetching vendor orders:", error);
        handleApiError(error);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  const handleclick = () => {
    console.log("Notification clicked");
    navigate("/Orders", { replace: true });
  };

  const [profile, setProfile] = useState(null);
  const fetchVendorProfile = (vendor_id) => {
    vendorProfile(vendor_id)
      .then((response) => {
        console.log(":::::::::::::::::::::::::::::::");
        console.log("Vendor Profile data:- ", response.vendor);
        setProfile(response.vendor);
      })
      .catch((error) => {
        console.error("Error fetching vendor profile:", error);
      });
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorProfile(vendorId);
    }
  }, [vendorId]);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        {/* <div className="navbar-title">{profile.name}</div> */}
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div className="navbar-actions">
          <div className="notification-container">
            <button
              className="notification-button"
              onClick={toggleNotifications}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">
                {orders.filter((order) => order.status == "pending").length}
              </span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notification-menu">
                <div className="dropdown-header">Notifications</div>
                <div className="dropdown-divider"></div>
                <div className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">New order received</div>
                    <div className="notification-text" onClick={handleclick}>
                      {orders.length} new orders
                    </div>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">
                      Order ready for delivery
                    </div>
                    <div className="notification-text">
                      {orders.filter((order) => order == "confirmed").length}{" "}
                      orders ready
                    </div>
                  </div>
                </div>
                {/* <div className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">Inventory alert</div>
                    <div className="notification-text">
                      Chicken stock low - 1 hour ago
                    </div>
                  </div>
                </div> */}
              </div>
            )}
          </div>

          <div className="Home-container-navigator">
            <div>
              <button className="Home-button-navigator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div className="user-container">
            <button className="user-button" onClick={toggleUserMenu}>
              <div className="user-avatar">JD</div>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="dropdown-header">My Account</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handlechnage}>
                  Profile
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
