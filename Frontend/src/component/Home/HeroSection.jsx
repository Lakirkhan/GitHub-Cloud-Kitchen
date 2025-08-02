import React, { useState } from "react";
import { FaMotorcycle, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/Home_Styles/Home.css";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("delivery");

  return (
    <div className="hm-hero-section">
      <div className="home-section-4 flex items-center justify-center text-center relative">
        <div className="hm-hero-container">
          <h1 className="hm-hero-heading">
            Are you <span className="hm-highlight">starving?</span>
          </h1>
          <p className="hm-hero-subtext">
            Within a few clicks, find meals that are accessible near you
          </p>

          <div className="hm-search-box">
            <div className="hm-tabs">
              <button
                className={
                  activeTab === "delivery" ? "hm-tab hm-active" : "hm-tab"
                }
                onClick={() => setActiveTab("delivery")}
              >
                <FaMotorcycle className="hm-icon" /> Delivery
              </button>
              <button
                className={
                  activeTab === "pickup" ? "hm-tab hm-active" : "hm-tab"
                }
                onClick={() => setActiveTab("pickup")}
              >
                <FaLock className="hm-icon" /> Pickup
              </button>
            </div>

            <div className="hm-input-container">
              <FaMapMarkerAlt className="hm-input-icon" />
              <input
                type="text"
                placeholder="Enter Your Address"
                className="hm-input"
              />
              <button className="hm-find-food-btn">Find Food</button>
            </div>
          </div>
        </div>
        <div>
          <img
            src="../../src/assets/Home-banner/02.png"
            alt="banner2"
            className="roatating-image"
            style={{ width: "500px", height: "500px"}}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
