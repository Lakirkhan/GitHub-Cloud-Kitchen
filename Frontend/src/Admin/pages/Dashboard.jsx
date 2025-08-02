import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Search, Filter, MoreVertical, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  ChefHat,
  Clock,
  Coffee,
  DollarSign,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Package,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
  X,
  Bell,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { PopularItemApi } from "../AdminApi/PopularItemApi";
import { PopularCategoriesApi } from "../AdminApi/PopularCategorieApi";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_baseUrl}/fetchHistory`
        );
        const result = await response.json();
        if (result.status === "success") {
          setOrders(result.history.reverse()); // Set the orders from the `history` array
        } else {
          console.error("Failed to fetch orders:", result);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await PopularItemApi(); // Call API
        console.log("API Response for popular items in admin:", response);

        // Ensure response is an object and extract the items array
        if (response && Array.isArray(response.items)) {
          setPopularItems(response.items);
        } else {
          console.error("Invalid response format:", response);
          setPopularItems([]); // Set empty array to avoid errors
        }
      } catch (error) {
        console.error("Error fetching popular items:", error);
        setPopularItems([]); // Set empty array in case of error
      }
    };

    fetchPopularItems();
  }, []);

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.item_total, 0);

  // Calculate total number of orders
  const totalOrders = orders.length;
  const data = [
    { name: "Revenue", value: totalRevenue },
    { name: "Orders", value: totalOrders * 40 },
  ];

  const columns = [
    {
      key: "id",
      title: "Order ID",
      render: (value) => (
        <span className="font-medium text-gray-900">{`#ORD-${value}`}</span>
      ),
    },
    {
      key: "billingInfo",
      title: "Customer",
      render: (value) => {
        try {
          const billingInfo = JSON.parse(value);
          const customerName =
            billingInfo.name ||
            billingInfo.recipient_name ||
            "Unknown Customer";
          return (
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${(() => {
                  const colors = [
                    "bg-red-500",
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-indigo-500",
                    "bg-teal-500",
                  ];
                  let hash = 0;
                  for (let i = 0; i < customerName.length; i++) {
                    hash = customerName.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  return colors[Math.abs(hash) % colors.length];
                })()}`}
              >
                {(() => {
                  const words = customerName.trim().split(/\s+/);
                  if (words.length === 1) {
                    return (
                      words[0][0] + (words[0][1] || words[0][0])
                    ).toUpperCase();
                  }
                  return (
                    words[0][0] + words[words.length - 1][0]
                  ).toUpperCase();
                })()}
              </div>

              <span className="font-medium">{customerName}</span>
            </div>
          );
        } catch (error) {
          console.error("Error parsing billingInfo:", error);
          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Unknown Customer"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">Unknown Customer</span>
            </div>
          );
        }
      },
    },
    {
      key: "cartItems",
      title: "Items",
      render: (value) => {
        const cartItems = JSON.parse(value);
        return cartItems.length;
      },
    },
    {
      key: "item_total",
      title: "Total",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => {
        const variants = {
          Delivered: "success",
          "In Transit": "info",
          Processing: "warning",
          pending: "error",
        };
        return <StatusBadge status={value} variant={variants[value]} />;
      },
    },
    {
      key: "order_date",
      title: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "",
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      ),
    },
  ];

  const [categories, setCategories] = useState([]);

  // Api of the popular Categories Starts here
  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await PopularCategoriesApi();
        console.log("Full API Response:", response); // Debugging log
        if (response && response.categories) {
          setCategories(response.categories); // Set the categories state
        } else {
          console.error("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error fetching popular categories:", error);
        setCategories([]); // Reset to empty array on error
      }
    };

    fetchPopularCategories();
  }, []);
  // Api of the popular Categories Ends here

  const categoryColors = [
    "bg-blue-600",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  return (
    <>
      {/* Stats Cards */}

      {/*  this parts starts Lakir edits on 18 march  */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="bg-blue-900 text-white p-2 rounded-full">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          {loading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800">
                ₹{totalRevenue.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 mt-1">⬆ 47% Last Week</p>
            </>
          )}
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <div className="bg-blue-900 text-white p-2 rounded-full">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          {loading ? (
            <div className="text-2xl font-bold">Loading...</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800">
                +{totalOrders}
              </div>
              <p className="text-sm text-gray-500 mt-1">⬆ 29% Last Week</p>
            </>
          )}
        </div>

        {/* Avg. Delivery Time Card */}
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Avg. Delivery Time
            </h3>
            <div className="bg-blue-900 text-white p-2 rounded-full">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">30 Min</div>
          <p className="text-sm text-gray-500 mt-1">
            ⏳ -2 Min Late From Last Week
          </p>
        </div>
      </div>

      {/*this parts ends Lakir edits on 18 march  */}

      {/* Tabs */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-1 border rounded-md bg-gray-50 p-1">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeTab === "overview"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeTab === "orders"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Recent Orders
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeTab === "menu"
                  ? "bg-white shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("menu")}
            >
              Popular Items
            </button>
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-50">
              Download Report
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
              View All
            </button>
          </div> */}
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="bg-white rounded-lg border lg:col-span-4">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Overview</h3>
                </div>

                {/* Charts Starts here  Lakir khan  */}
                <div className="p-4">
                  <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Charts Starts Ends here lakir khan    */}
              </div>
              <div className="bg-white rounded-lg border lg:col-span-3">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Top Selling Categories</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Top performing food categories this month
                  </p>
                </div>

                {/* Categories Table Charts starts here  lakir khan  */}
                <div className="p-4">
                  <div className="space-y-4">
                    {console.log("Categories:", categories)}
                    {categories.map((category, index) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Dynamic color */}
                            <div
                              className={`h-4 w-4 rounded-full ${
                                categoryColors[index % categoryColors.length]
                              }`}
                            ></div>
                            <span className="text-sm font-medium">
                              {category.category_name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {category.order_count * 5}%
                          </span>{" "}
                          {/* Example calculation */}
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              categoryColors[index % categoryColors.length]
                            }`}
                            style={{ width: `${category.order_count * 5}%` }} // Example: Adjust width dynamically
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Categories Table Charts  ends here  */}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === "orders" && (
          <>
            <div className="max-h-[500px] overflow-y-auto">
              <DataTable
                columns={columns}
                data={orders}
                onRowClick={(order) => console.log("Order clicked:", order)}
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {orders.length} of {orders.length} orders
              </p>
            </div>
          </>
        )}

        {/* Menu Tab Content */}
        {activeTab === "menu" && (
          <div className="p-4">
            <div className="bg-white rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium">Popular Menu Items</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Top selling items from your menu this month
                </p>
              </div>
              <div className="p-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {console.log("Popular Items:", popularItems)}
                  {popularItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      {/* Name and Price Section */}
                      <div className="flex items-center justify-between pb-2">
                        
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <span className="text-md font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                          ₹ {item.price}
                        </span>
                      </div>

                      {/* Description Section */}
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>

                      {/* Status Section */}
                      {/* <div className="mt-3">
                        {item.status === "Available" ? (
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="bg-gray-300 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                            Limited
                          </span>
                        )}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t flex justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View All Menu Items
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-medium">Kitchen Status</h3>
            <p className="text-sm text-gray-500 mt-1">
              Current status of your cloud kitchens
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                {
                  name: "Downtown Kitchen",
                  status: "Active",
                  orders: 32,
                  capacity: 85,
                },
                {
                  name: "Uptown Kitchen",
                  status: "Active",
                  orders: 28,
                  capacity: 70,
                },
                {
                  name: "Westside Kitchen",
                  status: "Active",
                  orders: 24,
                  capacity: 60,
                },
                {
                  name: "Eastside Kitchen",
                  status: "Maintenance",
                  orders: 0,
                  capacity: 0,
                },
              ].map((kitchen, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{kitchen.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          kitchen.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {kitchen.status}
                      </span>
                      {kitchen.status === "Active" && (
                        <span className="text-xs text-gray-500">
                          {kitchen.orders} orders in queue
                        </span>
                      )}
                    </div>
                  </div>
                  {kitchen.status === "Active" && (
                    <div className="text-right">
                      <div className="text-sm font-medium">Capacity</div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${kitchen.capacity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{kitchen.capacity}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <button className="w-full px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
              Manage Kitchens
            </button>
          </div>
        </div> */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recent Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              Stay updated with the latest alerts
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                {
                  title: "New order received",
                  description: "Order #ORD-7246 received from Sarah Johnson",
                  time: "2 min ago",
                  icon: ShoppingBag,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Inventory alert",
                  description: "Low stock for Chicken (3 units remaining)",
                  time: "15 min ago",
                  icon: Package,
                  color: "bg-yellow-100 text-yellow-700",
                },
                {
                  title: "Delivery delayed",
                  description: "Order #ORD-7240 delivery delayed by 10 minutes",
                  time: "32 min ago",
                  icon: Clock,
                  color: "bg-orange-100 text-orange-700",
                },
                {
                  title: "Kitchen maintenance",
                  description:
                    "Eastside Kitchen scheduled for maintenance tomorrow",
                  time: "1 hour ago",
                  icon: Settings,
                  color: "bg-purple-100 text-purple-700",
                },
                {
                  title: "New review",
                  description: "5-star review received for Margherita Pizza",
                  time: "2 hours ago",
                  icon: Star,
                  color: "bg-green-100 text-green-700",
                },
              ].map((notification, index) => (
                <div key={index} className="flex gap-4">
                  <div
                    className={`${notification.color} p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0`}
                  >
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <button className="w-full px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
