import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCartApi } from "../../services/Cart_api";
import { useNavigate } from "react-router-dom";
import { Clock, Flame, Heart, ShoppingCart, Star } from "lucide-react";
import { getRatingApi } from "../../services/Reviews";
import { useEffect, useState } from "react";

const MenuItem = ({ item }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState();
  useEffect(() => {
    getRating();
  }, []);
  const getRating = async () => {
    try {
      const data = await getRatingApi({ menu_id: item.id });
      setRating(data);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };
  const notify = () => {
    toast.success("Item added to cart!", {
      position: "top-center",
      closeOnClick: true,
      autoClose: 1000,
    });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigating when clicking "Add to Cart"
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



  const handleItemClick = () => {
    navigate(`/menu/item/${item.id}`); // Navigate to the item detail page
  };

  return (
    <div
      className="relative  flex flex-col rounded-xl shadow-lg bg-white overflow-hidden w-[280px] h-[320px] cursor-pointer hover:shadow-xl transition-all"
      onClick={handleItemClick}
    >

      {/* Food Image */}
      <div className="w-full h-40 overflow-hidden relative">
        <img
          src={`${import.meta.env.VITE_baseUrl}${item.image}`}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-3 flex-grow">
        {/* Category/Cuisine Tag */}
        <div className="flex gap-8 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
            {item.category || "Main Course"}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full ">
            {item.tbl_vendor?.name || "Unknown"}
          </span>
        </div>

        {/* Food Name */}
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {item.name}
        </h3>
        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {item.description ||
            "Delicious dish prepared with fresh ingredients and authentic spices."}
        </p>

        {/* Ratings */}
        <div className="flex items-center mt-2">
          <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
            <span className="text-xs font-bold text-green-800">
              {rating?.average_rating || "0"}
            </span>
            <Star className="w-3 h-3 ml-0.5 text-green-800 fill-green-800" />
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({rating?.rating_count || "0"}+ ratings)
          </span>
        </div>

        {/* Prep Time */}
        {/* <div className="flex items-center mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>{item.prepTime || "20-25"} mins</span>
        </div> */}
      </div>

      {/* Bottom Section with Price and Add to Cart */}
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
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default MenuItem;
