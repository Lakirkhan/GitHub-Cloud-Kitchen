import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Coffee,
  Package,
  Users,
  Settings,
  LogOut,
  ChefHat,
  X,
  Layout,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authActions";
import { useDispatch } from "react-redux";
import { UserProfileApi } from "../../services/ProfileUserAPi";

const SidebarNav = ({ handleLogout }) => {
  const location = useLocation();

  const menuSections = [
    {
      title: "Dashboard",
      items: [
        {
          icon: <LayoutDashboard className="h-4 w-4" />,
          label: "Overview",
          path: "/admin",
        },
        {
          icon: <BarChart3 className="h-4 w-4" />,
          label: "Analytics",
          path: "/admin/analytics",
        },
        {
          icon: <ShoppingBag className="h-4 w-4" />,
          label: "Orders",
          path: "/admin/orders",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          icon: <Layout className="h-4 w-4" />,
          label: "Category",
          path: "/admin/category",
        },
        {
          icon: <Coffee className="h-4 w-4" />,
          label: "Menu Items",
          path: "/admin/menu-items",
        },
        {
          icon: <Package className="h-4 w-4" />,
          label: "Vendors",
          path: "/admin/vendors",
        },
        {
          icon: <Users className="h-4 w-4" />,
          label: "Customers",
          path: "/admin/customers",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          icon: <Settings className="h-4 w-4" />,
          label: "General",
          path: "/admin/settings",
        },
        {
          icon: <LogOut className="h-4 w-4" />,
          label: "Logout",
          path: "/logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const menuContent = useMemo(() => {
    return menuSections.map((section) => (
      <div key={section.title} className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
          {section.title}
        </h2>
        <div className="space-y-1">
          {section.items.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={(e) => {
                if (item.path === "/logout") {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              role="button"
              aria-label={item.label}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${
                location.pathname === item.path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    ));
  }, [location.pathname]);

  return <nav className="overflow-y-auto h-full pb-7">{menuContent}</nav>;
};

const Sidebar = ({ isMobileNavOpen, setIsMobileNavOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    user: {
      name: "",
      email: "",
      mobileNo: "",
    },
    address: "",
    bio: "",
    avatar: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await UserProfileApi();
      console.log("Fetched profile data:", response);
      setProfile(response);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:flex fixed md:flex-col md:w-64 md:min-h-screen`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <ChefHat className="h-6 w-6" />
            {profile?.user?.name || "Admin"}
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 md:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav handleLogout={handleLogout} />
        <div className="p-4 border-t">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={profile?.avatar || "/placeholder-user.jpg"}
                alt="User"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {profile?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
