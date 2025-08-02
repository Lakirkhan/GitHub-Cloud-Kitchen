"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectToken } from "../redux/auth/authSelector";
import { FaShoppingCart, FaUser, FaUserPlus } from "react-icons/fa";
import { logout } from "../redux/auth/authActions";
import { useLocation } from "react-router-dom";
import { fetchCategories } from "../services/Home_Categories_api";
import { LayoutDashboard, Briefcase } from "lucide-react";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const token = useSelector(selectToken);
  const role = useSelector((state) => state.auth.role);
  const flag = useSelector((state) => state.auth.flag);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log("Navbar - role:", role, "flag:", flag);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  let dropdownTimeout;

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Menu", path: "/menu", hasDropdown: true },
    { name: "About Us", path: "/aboutus" },
    { name: "Contact", path: "/contactus" },
  ];

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.category || []);
      } catch (error) {
        console.error("Error fetching categories navbar:", error);
      }
    };
    getCategories();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    Navigate("/login");
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  const handleMenuMouseEnter = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setShowMenuDropdown(true);
  };

  const handleMenuMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setShowMenuDropdown(false);
    }, 300);
  };

  const location = useLocation();

  useEffect(() => {
    const cartElement = document.getElementById("cartId");
    if (cartElement) {
      if (
        location.pathname === "/cart" ||
        location.pathname.startsWith("/checkout") ||
        location.pathname.startsWith("/profile")
      ) {
        cartElement.classList.add("bg-black", "shadow-md");
        cartElement.classList.remove("bg-transparent");
      } else if (location.pathname === "/menu" && !isSticky) {
        cartElement.classList.add("bg-transparent");
        cartElement.classList.remove("bg-black", "shadow-md");
      } else if (location.pathname === "/" && !isSticky) {
        cartElement.classList.add("bg-transparent");
        cartElement.classList.remove("bg-black", "shadow-md");
      } else {
        cartElement.classList.add("bg-black", "shadow-md");
        cartElement.classList.remove("bg-transparent");
      }
    }
  }, [location, isSticky]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleprofileclick = (event) => {
    event.preventDefault();
    setShowDropdown(false);
    setShowMenuDropdown(false);
    if (location.pathname.startsWith("/profile")) {
      return;
    }
    window.location.href = "/profile";
  };

  // Determine if user is admin or vendor
  const isAdmin = role == 2 && flag == 1;
  const isVendor = role == 3;

  console.log("Navbar - isAdmin:", isAdmin, "isVendor:", isVendor);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      className={`capitalize w-full top-0 left-0 z-50 h-16 transition-all duration-300 ${
        isSticky ? "fixed bg-white shadow-md" : "absolute bg-black"
      }`}
      id="cartId"
    >
      <nav className="container h-16 mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold tracking-wide">
          <Link to="/" className="hover:opacity-80 transition duration-300">
            <img src="logo-removebg.png" alt="logo" className="w-24" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden z-20 ${isSticky ? "text-black" : "text-white"}`}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <ul
          className={`hidden md:flex space-x-8 text-lg font-medium transition-all duration-300 ${
            isSticky ? "text-black" : "text-white"
          }`}
        >
          {navItems.map((item, index) => (
            <li
              key={index}
              className="group relative"
              onMouseEnter={item.hasDropdown ? handleMenuMouseEnter : undefined}
              onMouseLeave={item.hasDropdown ? handleMenuMouseLeave : undefined}
            >
              <Link
                to={item.path}
                className="px-4 py-2 transition-all duration-300 hover:text-yellow-400"
              >
                {item.name}
              </Link>
              <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-yellow-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
              {item.hasDropdown && showMenuDropdown && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg max-h-48 overflow-y-auto"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  {categories.map((category, i) => (
                    <Link
                      key={i}
                      to={`/menu/${category.id}`}
                      className="block px-4 py-2 text-black hover:bg-yellow-400 transition"
                    >
                      {category.category_name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Icons */}
        <div
          className={`hidden md:flex items-center space-x-6 transition-all duration-300 ${
            isSticky ? "text-black" : "text-white"
          }`}
        >
          <Link
            to="/cart"
            className="text-lg transition-all duration-300 hover:text-yellow-400"
          >
            <FaShoppingCart size={22} />
          </Link>
          {!token && (
            <Link to="/login" className="text-lg transition-all duration-300">
              <FaUserPlus size={22} />
            </Link>
          )}
          {token && (
            <>
              {/* Show admin dashboard link if user is admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-lg transition-all duration-300 hover:text-yellow-400"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard size={22} />
                </Link>
              )}

              {/* Show vendor dashboard link if user is vendor */}
              {isVendor && (
                <Link
                  to="/vendor"
                  className="text-lg transition-all duration-300 hover:text-yellow-400"
                  title="Vendor Dashboard"
                >
                  <Briefcase size={22} />
                </Link>
              )}

              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FaUser
                  onClick={handleprofileclick}
                  size={22}
                  className="cursor-pointer transition-all duration-300 hover:text-yellow-400"
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-35 bg-white border border-gray-300 shadow-lg rounded-lg">
                    <div className="absolute top-0 right-1 -mt-2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-black cursor-pointer "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-90 z-10 flex flex-col items-center justify-center">
            <ul className="flex flex-col items-center space-y-6 text-white text-xl">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  {item.hasDropdown ? (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                        className="px-4 py-2 transition-all duration-300 hover:text-yellow-400"
                      >
                        {item.name}
                      </button>
                      {showMenuDropdown && (
                        <div className="mt-2 flex flex-col items-center space-y-2">
                          {categories.map((category, i) => (
                            <Link
                              key={i}
                              to={`/menu/${category.id}`}
                              className="block px-4 py-1 text-white hover:text-yellow-400 transition"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setShowMenuDropdown(false);
                              }}
                            >
                              {category.category_name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="px-4 py-2 transition-all duration-300 hover:text-yellow-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}

              <div className="flex space-x-8 mt-6">
                <Link
                  to="/cart"
                  className="text-lg transition-all duration-300 hover:text-yellow-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaShoppingCart size={24} />
                </Link>
                {!token && (
                  <Link
                    to="/login"
                    className="text-lg transition-all duration-300 hover:text-yellow-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserPlus size={24} />
                  </Link>
                )}
                {token && (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-lg transition-all duration-300 hover:text-yellow-400"
                        title="Admin Dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={24} />
                      </Link>
                    )}
                    {isVendor && (
                      <Link
                        to="/vendor"
                        className="text-lg transition-all duration-300 hover:text-yellow-400"
                        title="Vendor Dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Briefcase size={24} />
                      </Link>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-white hover:text-yellow-400"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
