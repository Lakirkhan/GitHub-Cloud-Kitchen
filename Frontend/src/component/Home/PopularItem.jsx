"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PopularItemApi } from "../../services/PopularItemApi";
import { getRatingApi } from "../../services/Reviews";
import { addToCartApi } from "../../services/Cart_api";

const PopularItems = () => {
  const navigate = useNavigate();
  const [popularItems, setPopularItems] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await PopularItemApi();
        console.log("API Response for popular items in Home Page:", response);

        if (Array.isArray(response)) {
          setPopularItems(response);
        } else if (response && Array.isArray(response.items)) {
          setPopularItems(response.items);
        } else {
          console.error("Invalid API response format:", response);
          setPopularItems([]);
        }
      } catch (error) {
        console.error("Error fetching popular items:", error);
        setPopularItems([]);
      }
    };

    fetchPopularItems();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsData = {};
      for (const item of popularItems) {
        try {
          const rating = await getRatingApi({ menu_id: item.id });
          ratingsData[item.id] = rating || {
            average_rating: "0",
            rating_count: "0",
          };
        } catch (error) {
          console.error("Error fetching rating for item", item.id, error);
          ratingsData[item.id] = { average_rating: "0", rating_count: "0" };
        }
      }
      setRatings(ratingsData);
    };

    if (popularItems.length > 0) {
      fetchRatings();
    }
  }, [popularItems]);

  const handleAddToCart = async (item, e) => {
    e.stopPropagation();
    try {
      const response = await addToCartApi(item);
      if (response.status === "success") {
        toast.success("Item added to cart", {
          position: "top-center",
          closeOnClick: true,
          autoClose: 1000,
        });
        console.log("Add to cart item:", item);
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

  const handleItemClick = (itemId) => {
    navigate(`/menu/item/${itemId}`);
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
        Popular Items
      </h2>

      {popularItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {popularItems.slice(0, 9).map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex p-4">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-lg capitalize mb-1 text-gray-800 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                      <span className="text-xs font-bold text-green-800">
                        {ratings[item.id]?.average_rating || "0"}
                      </span>
                      <Star className="w-3 h-3 ml-0.5 text-green-800 fill-green-800" />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      ({ratings[item.id]?.rating_count || "0"}+ ratings)
                    </span>
                  </div>

                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium py-1.5 px-3 rounded-full transition-colors"
                    onClick={(e) => handleAddToCart(item, e)}
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 relative">
                  <img
                    src={`${import.meta.env.VITE_baseUrl}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm"
                  />
                  <div className=" gap-8 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full ">
                      {item.tbl_vendor?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">Loading items...</p>
        </div>
      )}
    </section>
  );
};

export default PopularItems;
