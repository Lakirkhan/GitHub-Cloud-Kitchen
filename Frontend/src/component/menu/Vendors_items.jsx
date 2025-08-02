import { useEffect, useState } from "react";
import { venderFetchMenu } from "../../Vendors/Services/VendorMenu";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Flame } from "lucide-react";
import { addToCartApi } from "../../services/Cart_api";
import { toast } from "react-toastify";
import { getRatingApi } from "../../services/Reviews";

const Vendors_items = () => {
  const { id } = useParams();
  console.log("Vendor ID:", id);
  const [menuItems, setMenuItems] = useState([]);
  const [itemRatings, setItemRatings] = useState({});

  // Fetch menu items
  const fetchItems = async () => {
    try {
      const data = await venderFetchMenu(id);
      console.log("Fetched menu items:", data.items);
      setMenuItems(data.items);

      // Fetch ratings for each item
      const ratingsObj = {};
      for (const item of data.items) {
        try {
          const ratingData = await getRatingApi({ menu_id: item.id });
          console.log("Rating data:", ratingData);
          ratingsObj[item.id] = ratingData;
        } catch (err) {
          console.error(`Failed to fetch rating for item ${item.id}`, err);
          ratingsObj[item.id] = { average_rating: 0 }; // fallback
        }
      }
      setItemRatings(ratingsObj);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // Toast success
  const notify = () => {
    toast.success("Item added to cart!", {
      position: "top-center",
      closeOnClick: true,
      autoClose: 1000,
    });
  };

  // Add to cart
  const handleAddToCart = async (e, item) => {
    e.stopPropagation();
    try {
      const response = await addToCartApi(item);
      if (response.status === "success") {
        notify();
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart", {
        position: "top-center",
        closeOnClick: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Vendor's Items
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col rounded-xl shadow-lg bg-white overflow-hidden w-full h-[320px] cursor-pointer hover:shadow-xl transition-all"
          >
            {/* BESTSELLER Badge */}
            {item.bestseller && (
              <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                BESTSELLER
              </div>
            )}

            {/* Image */}
            <div className="w-full h-40 overflow-hidden relative">
              <img
                src={`${import.meta.env.VITE_baseUrl}${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col p-3 flex-grow">
              <div className="flex gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  {item.category || "Main Course"}
                </span>
                {item.spicyLevel > 0 && (
                  <div className="flex items-center">
                    {[...Array(item.spicyLevel)].map((_, i) => (
                      <Flame key={i} className="w-3 h-3 text-red-500" />
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {item.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.description ||
                  "Delicious dish prepared with fresh ingredients and authentic spices."}
              </p>

              {/* Ratings */}
              <div className="flex items-center mt-2">
                <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                  <span className="text-xs font-bold text-green-800">
                    {itemRatings[item.id]?.average_rating || "0"}
                  </span>
                  <Star className="w-3 h-3 ml-0.5 text-green-800 fill-green-800" />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  ({item.rating_count || "0"}+ ratings)
                </span>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center">
                <span className="text-xl font-bold text-amber-600">
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
              <button
                className="flex items-center gap-1 py-1.5 px-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                onClick={(e) => handleAddToCart(e, item)}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors_items;
