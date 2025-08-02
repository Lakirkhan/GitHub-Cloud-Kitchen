import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Filter, Plus, Edit2, Minus } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import MenuItemFormModal from "../components/MenuItemFormModal";
import {
  addMenuItemApi,
  fetchCategoryApi,
  fetchMenuItems,
  updateMenuItemApi,
  deleteMenuItemApi,
} from "../AdminApi/adminApi";

export function MenuItemsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    fetchItems();
  }, [page, selectedCategory, selectedStatus, searchQuery]);

  const fetchItems = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await fetchMenuItems(page, 10, {
        search: searchQuery,
        category: selectedCategory !== "All" ? selectedCategory : "",
        active: selectedStatus !== "All" ? selectedStatus : "",
      });

      if (data.status === "success") {
        setMenuItems((prevItems) =>
          page === 1 ? data.items : [...prevItems, ...data.items]
        );
        setHasMore(data.items.length > 0);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setMenuItems([]);
    fetchItems();
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  useEffect(() => {
    if (!deleteMode) {
      setSelectedItems(new Set());
    }
  }, [deleteMode]);

  const fetchAvailableCategories = async () => {
    const data = await fetchCategoryApi();
    setAvailableCategories(data.category);
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
        data = await addMenuItemApi(formData);
      }

      if (data?.status === "success") {
        setMenuItems([]);
        setPage(1);
        fetchItems();
        setModalOpen(false);
      } else {
        console.error("Failed to save item:", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteItems = async () => {
    if (selectedItems.size === 0) return;

    if (!window.confirm("Are you sure you want to delete the selected items?"))
      return;

    try {
      for (let id of selectedItems) {
        await deleteMenuItemApi(id); // Assumes delete API takes a single ID
      }

      setSelectedItems(new Set());
      setMenuItems([]);
      setPage(1);
      setDeleteMode(false);
      fetchItems();
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const lastMenuItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="p-6">
      <PageHeader title="Menu Items" description="Manage your restaurant menu">
        {/* <button
          onClick={() => openModal()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button> */}

        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className={`px-2 py-2 text-sm font-medium text-white ${
            deleteMode
              ? "bg-gray-500 hover:bg-gray-700"
              : "bg-red-500 hover:bg-red-700"
          } rounded-md flex items-center gap-2`}
        >
          <Minus className="h-4 w-4" />
          {deleteMode ? "Cancel Delete" : "Delete Item"}
        </button>

        {deleteMode && selectedItems.size > 0 && (
          <button
            onClick={handleDeleteItems}
            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Confirm Delete ({selectedItems.size})
          </button>
        )}
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item, index) => {
              const isLast = index === menuItems.length - 1;
              const isChecked = selectedItems.has(item.id);

              return (
                <div
                  key={item.id}
                  ref={isLast ? lastMenuItemRef : null}
                  className={`bg-white border rounded-lg overflow-hidden relative ${
                    deleteMode ? "border-red-500" : ""
                  }`}
                >
                  {deleteMode && (
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 w-4 h-4"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = new Set(selectedItems);
                        if (e.target.checked) {
                          updated.add(item.id);
                        } else {
                          updated.delete(item.id);
                        }
                        setSelectedItems(updated);
                      }}
                    />
                  )}
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={
                        `${import.meta.env.VITE_baseUrl}${item.image}` ||
                        "/placeholder.svg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description.length > 50
                            ? item.description.slice(0, 50) + "..."
                            : item.description}
                        </p>
                      </div>
                      <StatusBadge
                        status={item.active ? "Active" : "Inactive"}
                        variant={item.active ? "success" : "error"}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </div>
                      {!deleteMode && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-sm text-gray-600">
                              {item.rating || "4.5"}
                            </span>
                          </div>
                          <button
                            onClick={() => openModal(item)}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {loading && (
            <p className="text-center text-sm text-gray-700 py-4">Loading...</p>
          )}
          {!hasMore && (
            <p className="text-center text-sm text-gray-700 py-4">
              No more items to load
            </p>
          )}
        </div>

        <MenuItemFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          item={editingItem}
          onSave={(data) => {
            console.log("onSave callback invoked with data:", data);
            handleSave(data);
          }}
        />
      </div>
    </div>
  );
}
