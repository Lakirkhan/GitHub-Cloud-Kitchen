import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  Filter,
  Search,
  ShoppingCart,
  Star,
  Clock,
  Info,
} from "lucide-react";
import { fetchItemsByCategoryIdApi } from "../services/Home_Categories_api";
import { addToCartApi } from "../services/Cart_api";
import "../styles/CategoryMenu/CategoryMenu.css";
import { getRatingApi } from "../services/Reviews";

const CategoryMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const data = await fetchItemsByCategoryIdApi(id);
        if (data.status === "success") {
          setItems(data.items);
          setFilteredItems(data.items);
        } else {
          throw new Error("Failed to fetch categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleAddToCart = async (item, e) => {
    e.stopPropagation();

    const button = e.currentTarget;
    button.disabled = true;

    // Store original content and show loading spinner
    const originalContent = button.innerHTML;
    button.innerHTML =
      '<span class="loading-spinner"><svg class="spinner-icon" viewBox="0 0 24 24"></svg></span>';

    try {
      const response = await addToCartApi(item);
      if (response.status === "success") {
        toast.success("Item added to cart!", {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast.error("Failed to add item to cart", {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      button.disabled = false;
      button.innerHTML = originalContent;
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // const [rating, setRating] = useState();
  // useEffect(() => {
  //   getRating();
  // }, []);
  // const getRating = async () => {
  //   try {
  //     const data = await getRatingApi({ menu_id: item.id });
  //     setRating(data);
  //   } catch (error) {
  //     console.error("Error fetching rating:", error);
  //   }
  // };

  return (
    <div className="category-page capitalize">
      <div className="category-container">
        {/* Header with back button */}
        <div className="category-header">
          <button className="back-button" onClick={goBack}>
            <ChevronLeft className="icon" />
          </button>
          <h1 className="category-title">Delicious Menu</h1>
        </div>

        {/* Search and filter bar */}
        <div className="search-filter-container">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-button">
            <Filter className="filter-icon" />
            <span>Filter</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="category-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-header">
                  <div className="skeleton-title"></div>
                </div>
                <div className="skeleton-content">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
                <div className="skeleton-footer">
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-container">
            <Info className="error-icon" />
            <h3 className="error-title">{error}</h3>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
              <div className="category-grid">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="category-card"
                  >
                    <div className="card-image-container">
                      <img
                        src={`${import.meta.env.VITE_baseUrl}${item.image}`} // Image from API
                        alt={item.name}
                        className="card-image"
                      />
                      {/* <span className="card-badge rating-badge">
                        <Star className="badge-icon" />
                        {rating ? rating.rating_count : "0"}{" "}
                      </span> */}
                    </div>
                    <div className="card-header">
                      <div className="card-title-container">
                        <h3 className="card-title-ct">{item.name}</h3>
                        {/* <span className="time-badge">
                          <Clock className="badge-icon" />
                          20 min
                        </span> */}
                      </div>
                    </div>
                    <div className="card-content">
                      <p className="card-description">{item.description}</p>
                    </div>
                    <div className="card-divider"></div>
                    <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-amber-600">
                          ₹{item.price.toFixed(2)}
                        </span>
                        {Math.random() > 0.5 && (
                          <span className="popular-badge">Popular</span>
                        )}
                      </div>
                      <button
                        className="flex items-center gap-1 py-1.5 px-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                        onClick={(e) => handleAddToCart(item, e)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
                {/* <div className="flex items-center mt-2">
                  <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                    <span className="text-xs font-bold text-green-800">
                      {rating?.average_rating || "0"}
                    </span>
                    <Star className="w-3 h-3 ml-0.5 text-green-800 fill-green-800" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({rating?.rating_count || "0"}+ ratings)
                  </span>
                </div> */}
              </div>
            ) : (
              <div className="empty-container">
                <Info className="empty-icon" />
                <h3 className="empty-title">No items found</h3>
                <p className="empty-description">
                  We couldn't find any menu items matching your search. Try
                  different keywords or browse our categories.
                </p>
                <button
                  className="clear-button"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;
