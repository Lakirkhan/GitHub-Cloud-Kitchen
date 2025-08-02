import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import "./setting.css";
import { useSelector } from "react-redux";
import { UpdateProfileVendorApi, vendorProfile } from "../../Services/VendorPopular";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  const vendorId = useSelector((state) => state.auth.id);
  const [profile, setProfile] = useState(null);

  // Editable profile fields
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchVendorProfile = (vendor_id) => {
    vendorProfile(vendor_id)
      .then((response) => {
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

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setMobileNo(profile.mobileNo || "");
      setAddress(profile.address || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await UpdateProfileVendorApi(
        name,
        mobileNo,
        address,
        imageFile
      );
      alert("Profile updated successfully!");
      fetchVendorProfile(vendorId); // refresh profile after update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <span>Profile</span>
        </button>
        <button
          className={`tab-button ${activeTab === "restaurant" ? "active" : ""}`}
          onClick={() => setActiveTab("restaurant")}
        >
          <span>Restaurant</span>
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "profile" && (
          <Card className="settings-card">
            <div className="card-header">
              <h3 className="card-title">Profile</h3>
              <div className="card-subtitle">
                Manage your personal information
              </div>
            </div>

            <div className="card-content">
              <div className="profile-avatar">
                <div className="avatar">JD</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile No</label>
                <input
                  type="tel"
                  className="form-input"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label ">Email</label>
                <input
                  type="email"
                  disabled
                  className="form-input"
                  value={email}
                  readOnly
                />
              </div>
            </div>

            <div className="card-footer">
              <Button className="save-button" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "restaurant" && (
          <Card className="settings-card">
            <div className="card-header">
              <h3 className="card-title">Restaurant Information</h3>
              <div className="card-subtitle">
                Manage your restaurant details
              </div>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="restaurant-name" className="form-label">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurant-name"
                  className="form-input"
                  defaultValue="Cloud Kitchen"
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-address" className="form-label">
                  Address
                </label>
                <textarea
                  id="restaurant-address"
                  className="form-textarea"
                  defaultValue="123 Main Street, New York, NY 10001"
                ></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="restaurant-phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="restaurant-phone"
                    className="form-input"
                    defaultValue="+1 (555) 987-6543"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="restaurant-email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="restaurant-email"
                    className="form-input"
                    defaultValue="contact@cloudkitchen.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-description" className="form-label">
                  Description
                </label>
                <textarea
                  id="restaurant-description"
                  className="form-textarea"
                  defaultValue="Authentic Indian cuisine delivered to your doorstep."
                ></textarea>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4 className="toggle-title">Auto-Accept Orders</h4>
                  <p className="toggle-description">
                    Automatically accept incoming orders
                  </p>
                </div>
                <label className="toggle-label">
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={autoAcceptOrders}
                      onChange={(e) => setAutoAcceptOrders(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Business Hours</label>
                <div className="business-hours">
                  <div className="hours-row">
                    <span className="day-range">Monday - Friday</span>
                    <span className="time-range">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="hours-row">
                    <span className="day-range">Saturday - Sunday</span>
                    <span className="time-range">11:00 AM - 11:00 PM</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="edit-hours-button"
                >
                  Edit Hours
                </Button>
              </div>
            </div>

            <div className="card-footer">
              <Button className="save-button">Save Changes</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
