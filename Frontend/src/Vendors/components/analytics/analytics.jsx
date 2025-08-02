import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import "./analytics.css";

export function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // Sample data
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%" },
    { title: "Orders", value: "+2,350", change: "+12.2%" },
    { title: "Average Order Value", value: "$19.25", change: "+2.5%" },
    { title: "Customers", value: "+573", change: "+10.1%" },
  ];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const selectTimeRange = (range) => {
    setTimeRange(range);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics</h2>
        <div className="analytics-actions">
          <div className="dropdown-container">
            <Button variant="outline" size="sm" onClick={toggleDropdown}>
              <svg
                className="button-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {timeRange}
              <svg
                className="dropdown-arrow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => selectTimeRange("Last 7 Days")}
                >
                  Last 7 Days
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => selectTimeRange("Last 30 Days")}
                >
                  Last 30 Days
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => selectTimeRange("Last 90 Days")}
                >
                  Last 90 Days
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => selectTimeRange("This Year")}
                >
                  This Year
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => selectTimeRange("All Time")}
                >
                  All Time
                </div>
              </div>
            )}
          </div>
          <Button size="sm">
            <svg
              className="button-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </Button>
        </div>
      </div>

      <div className="analytics-tabs">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            Sales
          </button>
          <button
            className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`tab-button ${
              activeTab === "customers" ? "active" : ""
            }`}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-title">{stat.title}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.change} from last month</div>
          </Card>
        ))}
      </div>

      <div className="analytics-grid">
        <Card className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Revenue Over Time</h3>
            <div className="card-subtitle">
              Monthly revenue for the current year
            </div>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: "60%" }}></div>
                <div className="chart-bar" style={{ height: "45%" }}></div>
                <div className="chart-bar" style={{ height: "75%" }}></div>
                <div className="chart-bar" style={{ height: "40%" }}></div>
                <div className="chart-bar" style={{ height: "30%" }}></div>
                <div className="chart-bar" style={{ height: "35%" }}></div>
                <div className="chart-bar" style={{ height: "55%" }}></div>
                <div className="chart-bar" style={{ height: "65%" }}></div>
                <div className="chart-bar" style={{ height: "70%" }}></div>
                <div className="chart-bar" style={{ height: "50%" }}></div>
                <div className="chart-bar" style={{ height: "60%" }}></div>
                <div className="chart-bar" style={{ height: "80%" }}></div>
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="pie-chart-card">
          <div className="card-header">
            <h3 className="card-title">Sales by Category</h3>
            <div className="card-subtitle">
              Distribution of sales across menu categories
            </div>
          </div>
          <div className="card-content">
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div
                  className="pie-slice"
                  style={{ "--percentage": "45%", "--color": "#0088FE" }}
                ></div>
                <div
                  className="pie-slice"
                  style={{ "--percentage": "20%", "--color": "#00C49F" }}
                ></div>
                <div
                  className="pie-slice"
                  style={{ "--percentage": "15%", "--color": "#FFBB28" }}
                ></div>
                <div
                  className="pie-slice"
                  style={{ "--percentage": "12%", "--color": "#FF8042" }}
                ></div>
                <div
                  className="pie-slice"
                  style={{ "--percentage": "8%", "--color": "#8884D8" }}
                ></div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#0088FE" }}
                  ></div>
                  <div className="legend-label">Main Course (45%)</div>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#00C49F" }}
                  ></div>
                  <div className="legend-label">Appetizers (20%)</div>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#FFBB28" }}
                  ></div>
                  <div className="legend-label">Breads (15%)</div>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#FF8042" }}
                  ></div>
                  <div className="legend-label">Beverages (12%)</div>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: "#8884D8" }}
                  ></div>
                  <div className="legend-label">Desserts (8%)</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="analytics-grid">
        <Card className="bar-chart-card">
          <div className="card-header">
            <h3 className="card-title">Top Selling Items</h3>
            <div className="card-subtitle">
              Most popular items by number of orders
            </div>
          </div>
          <div className="card-content">
            <div className="horizontal-bar-chart">
              <div className="bar-item">
                <div className="bar-label">Chicken Biryani</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: "80%" }}></div>
                  <div className="bar-value">120</div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Butter Chicken</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: "65%" }}></div>
                  <div className="bar-value">98</div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Paneer Tikka</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: "57%" }}></div>
                  <div className="bar-value">86</div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Garlic Naan</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: "48%" }}></div>
                  <div className="bar-value">72</div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Mango Lassi</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: "43%" }}></div>
                  <div className="bar-value">65</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bar-chart-card">
          <div className="card-header">
            <h3 className="card-title">Orders by Time of Day</h3>
            <div className="card-subtitle">
              Distribution of orders throughout the day
            </div>
          </div>
          <div className="card-content">
            <div className="vertical-bar-chart">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: "30%" }}>
                  <div className="bar-value">15</div>
                </div>
                <div className="chart-bar" style={{ height: "56%" }}>
                  <div className="bar-value">28</div>
                </div>
                <div className="chart-bar" style={{ height: "90%" }}>
                  <div className="bar-value">45</div>
                </div>
                <div className="chart-bar" style={{ height: "64%" }}>
                  <div className="bar-value">32</div>
                </div>
                <div className="chart-bar" style={{ height: "50%" }}>
                  <div className="bar-value">25</div>
                </div>
                <div className="chart-bar" style={{ height: "76%" }}>
                  <div className="bar-value">38</div>
                </div>
                <div className="chart-bar" style={{ height: "84%" }}>
                  <div className="bar-value">42</div>
                </div>
                <div className="chart-bar" style={{ height: "40%" }}>
                  <div className="bar-value">20</div>
                </div>
              </div>
              <div className="chart-labels">
                <span>8-10 AM</span>
                <span>10-12 PM</span>
                <span>12-2 PM</span>
                <span>2-4 PM</span>
                <span>4-6 PM</span>
                <span>6-8 PM</span>
                <span>8-10 PM</span>
                <span>10-12 AM</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
