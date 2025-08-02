import { useState } from "react";
import { VendorSidebar } from "./components/sidebar/VendorSidebar";
import { Dashboard } from "./components/dashboard/dashboard";
import { Orders } from "./components/orders/order";
import { Menu } from "./components/menu/menu";
import { Settings } from "./components/settings/setting";
import { Analytics } from "./components/analytics/analytics";
import { Navbar } from "./components/navbar/navbar";
import "./vendor-panel.css";

export function VendorPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "menu":
        return <Menu />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`vendor-panel ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <VendorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
      />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content-container">{renderContent()}</div>
      </div>
    </div>
  );
}
