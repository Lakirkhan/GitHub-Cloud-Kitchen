import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import "./menu.css";
import { venderAddMenuItem, venderFetchMenu } from "../../Services/VendorMenu";
import { useSelector } from "react-redux";
import VendorMenuItemFormModal from "./VendorMenuItemFormModal";
import { updateMenuItemApi } from "../../../Admin/AdminApi/adminApi";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  // const [showAddDialog, setShowAddDialog] = useState(false);
  // const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get vendorId from Redux
  const vendorId = useSelector((state) => state.auth.id);
  console.log("Vendor ID from Redux:", vendorId);

  // Fetch menu items
  const [menuItems, setMenuItems] = useState([]);
  const fetchItems = () => {
    venderFetchMenu(vendorId)
      .then((data) => {
        console.log("Fetched menu items in vendor panel: ", data);
        setMenuItems(data.items);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  };
  useEffect(() => {
    fetchItems();
  }, [vendorId]);


  // const handleAvailabilityToggle = (id) => {
  //   setMenuItems(
  //     menuItems.map((item) =>
  //       item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
  //     )
  //   );
  // };

  const handleAddItem = () => {
    const newItem = {
      id: menuItems.length + 1,
      name: "New Item",
      description: "Description",
      price: 9.99,
      category: "Main Course",
      image: "/placeholder.svg?height=100&width=100",
      isAvailable: true,
      isVegetarian: false,
      isSpicy: false,
    };

    setMenuItems([...menuItems, newItem]);
    setShowAddDialog(false);
  };

  const handleEditItem = () => {
    if (!editingItem) return;

    setMenuItems(
      menuItems.map((item) => (item.id === editingItem.id ? editingItem : item))
    );

    setShowEditDialog(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    setShowDropdown(null);
  };

  const openEditDialog = (item) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
    setShowDropdown(null);
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    if (showDropdown === id) {
      setShowDropdown(null);
    } else {
      setShowDropdown(id);
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 25;

  // const toggleDescription = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev); // Toggle state
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    if (!values) {
      console.error("handleSave received undefined data!");
      return;
    }
    console.log("item value: ", values);

    const formData = new FormData();

    if (values.id) formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("category", values.category || "");
    formData.append("description", values.description);
    formData.append("status", values.status);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (values.existingImage) {
      formData.append("existingImage", values.existingImage);
    }

    try {
      let data;
      if (values.id) {
        data = await updateMenuItemApi(formData);
      } else {
        console.log("In vendor add item api");
        data = await venderAddMenuItem(formData);
        console.log("====================================");
        console.log("Returned data: " + data);
        console.log("====================================");
      }
      if (data?.status === "success") {
        setMenuItems([]); // Clear existing items
        fetchItems(); // Refetch items
        setModalOpen(false);
      } else {
        console.error("Failed to save item:", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="menu capitalize">
      <div className="menu-header">
        <h2 className="menu-title">Menu Management</h2>
        <div className="menu-actions">
          <Button variant="outline" size="sm">
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter
          </Button>
          <Button
            size="sm"
            // onClick={() => setShowAddDialog(true)}
            onClick={() => openModal()}
          >
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Item
          </Button>
        </div>
      </div>

      <div className="menu-tabs">
        <div className="search-container">
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
          <input
            type="search"
            className="search-input"
            placeholder="Search menu items..."
          />
        </div>
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <Card key={item.id} className="menu-item-card">
            <div className="menu-item-header">
              <div>
                <h3 className="menu-item-title">{item.name}</h3>
                {/* <p className="menu-item-description">{item.description}</p> */}
                <p className="menu-item-description">
                  {isExpanded
                    ? item.description
                    : `${item.description.substring(0, maxLength)}${
                        item.description.length > maxLength ? "...." : ""
                      }`}
                  {item.description.length > maxLength && (
                    <span
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                      onClick={toggleDescription}
                    >
                      {isExpanded ? " Show Less" : " Read More"}
                    </span>
                  )}
                </p>
              </div>
              <div className="dropdown-container">
                <button
                  className="action-button "
                  onClick={(e) => toggleDropdown(e, item.id)}
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
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>

                {showDropdown === item.id && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">Actions</div>
                    <div className="dropdown-divider"></div>
                    <div
                      className="dropdown-item"
                      onClick={() => openModal(item)}
                    >
                      <svg
                        className="dropdown-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <svg
                        className="dropdown-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="menu-item-content">
              <div className="menu-item-image">
                <img
                  src={`${import.meta.env.VITE_baseUrl}${item.image}`}
                  alt={item.name}
                />
              </div>
              <div className="menu-item-details">
                <div className="menu-item-badges">
                  <Badge variant="outline">{item.category}</Badge>
                  {item.isVegetarian && <Badge variant="success">Veg</Badge>}
                  {item.isSpicy && <Badge variant="danger">Spicy</Badge>}
                </div>
                <div className="menu-item-price">₹{item.price.toFixed(2)}</div>
              </div>
            </div>

            <div className="menu-item-footer">
              <div className="availability-toggle">
                <label className="toggle-label">
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      color: item.active ? "green" : "red",
                      backgroundColor: item.active
                        ? "rgba(0, 255, 0, 0.1)"
                        : "rgba(255, 0, 0, 0.1)",
                    }}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>

                  {/* <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => handleAvailabilityToggle(item.id)}
                    />
                    <span className="toggle-slider"></span>
                  </div> */}
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                // onClick={() => openEditDialog(item)}
                onClick={() => openModal(item)}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      {/* {showAddDialog && (
        <div className="dialog-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">Add Menu Item</h3>
              <button
                className="close-button"
                onClick={() => setShowAddDialog(false)}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" className="form-select">
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" className="form-textarea"></textarea>
              </div>
              <div className="form-group ">
                <label htmlFor="image">Image</label>
                <input type="file" id="image" accept="image/*" className="cursor-pointer" /> 
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span>Vegetarian</span>
                  <div className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span>Spicy</span>
                  <div className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>
            <div className="dialog-footer">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </div>
        </div>
      )} */}

      <VendorMenuItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        onSave={(data) => {
          console.log("onSave callback invoked with data:", data);
          handleSave(data);
        }}
      />

      {/* Edit Dialog */}
      {/* {showEditDialog && editingItem && (
        <div
          className="dialog-overlay"
          onClick={() => setShowEditDialog(false)}
        >
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">Edit Menu Item</h3>
              <button
                className="close-button"
                onClick={() => setShowEditDialog(false)}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  className="form-input"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-price">Price</label>
                <input
                  type="number"
                  id="edit-price"
                  step="0.01"
                  className="form-input"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      price: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  className="form-select"
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                >
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="form-textarea"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span>Vegetarian</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={editingItem.isVegetarian}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          isVegetarian: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span>Spicy</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={editingItem.isSpicy}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          isSpicy: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span>Available</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={editingItem.isAvailable}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>
            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditItem}>Save Changes</Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
