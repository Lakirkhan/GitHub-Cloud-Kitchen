import { Card } from "../ui/card";
import { Button } from "../ui/button";
import "./dashboard.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  venderFetchMenu,
  vendorOrder,
  vendorRevenue,
  vendorTodayRevenue,
} from "../../Services/VendorMenu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { vendorPopularItem } from "../../Services/VendorPopular";

export function Dashboard() {
  const vendorId = useSelector((state) => state.auth.id);
  console.log("Vendor ID from Redux:", vendorId);

  const [menuItems, setMenuItems] = useState([]);
  const [menuLength, setMenuLength] = useState(0);

  const fetchItems = () => {
    venderFetchMenu(vendorId)
      .then((data) => {
        console.log("Fetched menu items in vendor panel: ", data);

        let length = 0;

        if (Array.isArray(data)) {
          length = data.length;
          setMenuItems(data);
        } else if (Array.isArray(data.items)) {
          length = data.items.length;
          setMenuItems(data.items);
        } else if (typeof data === "object") {
          length = Object.keys(data).length;
          setMenuItems(data);
        }

        setMenuLength(length);
        console.log("Length of fetched items:", length);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [vendorId]);

  // API For Orders

  const [orders, setOrders] = useState([]);
  const fetchOrders = () => {
    vendorOrder(vendorId)
      .then((data) => {
        console.log("Fetched orders: ", data);
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  const [revenue, setRevenue] = useState([]);
  const fetchRevenue = () => {
    vendorRevenue(vendorId)
      .then((data) => {
        console.log("Fetched revenue: ", data);
        setRevenue(data);
      })
      .catch((error) => {
        console.error("Error fetching revenue:", error);
      });
  };
  useEffect(() => {
    fetchRevenue();
  }, [vendorId]);

  // API For today revenue
  const [todaysRevenue, setTodaysRevenue] = useState([]);
  const fetchTodaysRevenue = () => {
    vendorTodayRevenue(vendorId)
      .then((data) => {
        console.log("Fetched today's revenue: ", data);
        setTodaysRevenue(data);
      })
      .catch((error) => {
        console.error("Error fetching today's revenue:", error);
      });
  };
  useEffect(() => {
    fetchTodaysRevenue();
  }, [vendorId]);

  // Four Box data in dashboard lakir
  const stats = [
    {
      title: "Total Revenue",
      value: `₹ ${revenue.totalRevenue}`,
      change: "+20.1%",
      isPositive: true,
    },
    {
      title: "Orders",
      value: `${orders.totalOrders}`,
      change: "+12.2%",
      isPositive: true,
    },
    {
      title: "Menu Items",
      value: `${menuLength}`,
      change: "+4.1%",
      isPositive: true,
    },
    {
      title: "Today's Revenue",
      value: `₹ ${todaysRevenue.todayRevenue}`,
      change: "-1.5%",
      isPositive: false,
    },
  ];
  console.log("Fetched stats: ", stats);

  // Graph data Lakir
  const data = [
    { label: "Revenue", value: Number(revenue.totalRevenue) },
    { label: "Orders", value: Number(orders.totalOrders) },
  ];
  console.log("Fetched data: ", data);
  const maxValue = Math.max(...data.map((item) => item.value));
  console.log("Max value: ", maxValue);
  // Graph data ends here

  // For Download report LOgic which is in csv lakir

  // Function to convert stats to CSV and trigger download
  const handleDownloadReport = () => {
    const headers = ["Title", "Value"];
    const rows = stats.map((stat) => [stat.title, stat.value]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vendor_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Popular Items API
  const [popularItem, setPopularItems] = useState([]);
  const fetchPopularItems = () => {
    vendorPopularItem(vendorId)
      .then((data) => {
        console.log("Fetching popular items for vendor ID:", vendorId);
        console.log("Fetched popular items: ", data.items);
        setPopularItems(data.items);
      })
      .catch((error) => {
        console.error("Error fetching popular items:", error);
      });
  };
  useEffect(() => {
    fetchPopularItems();
  }, [vendorId]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <Button onClick={handleDownloadReport}>Download Report</Button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-icon">
                {index === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <text
                      x="0"
                      y="17"
                      fontSize="24"
                      fontFamily="Arial, sans-serif"
                    >
                      ₹
                    </text>
                  </svg>
                )}
                {index === 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                )}
                {index === 2 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                    <line x1="6" y1="17" x2="18" y2="17"></line>
                  </svg>
                )}
                {index === 3 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                )}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div
              className={`stat-change ₹{
                stat.isPositive ? "positive" : "negative"
              }`}
            >
              <span className="change-icon">
                {stat.isPositive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 9 12 15 6 9"></polyline>
                  </svg>
                )}
              </span>
              {stat.change} from last month
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-tabs">
        <div className="tabs-vendor">
          <button className="tab-button active ">Overview</button>
        </div>

        <div className="tab-content">
          <div className="dashboard-grid">
            <Card className="chart-card">
              <div className="card-header">
                <h3 className="card-title-ds">
                  Total Revenue && Total Orders Overview
                </h3>
              </div>
              <div className="card-content">
                <div className="chart-placeholder">
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
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#9370DB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="orders-card">
              <div className="card-header">
                <h3 className="card-title-ds">Popular Items</h3>
              </div>
              <div className="card-content">
                <div
                  className="overflow-y-auto"
                  style={{
                    maxHeight: "300px", // Adjust this height based on your design to show approx. 4-5 items
                  }}
                >
                  {popularItem.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${import.meta.env.VITE_baseUrl}${item.image}`}
                          alt="item"
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div className="flex flex-col">
                          <span className="text-lg font-bold">{item.name}</span>
                          <span className="text-sm text-gray-500">
                            Price:- ₹ {item.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Orders Count:- {item.order_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
