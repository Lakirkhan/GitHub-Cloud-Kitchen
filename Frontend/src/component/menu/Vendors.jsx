"use client";

import { useEffect, useState, useRef } from "react";
import { fetchAllVendors } from "../../services/menu_api";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, MapPin, Store, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { vendorRating } from "../../Vendors/Services/vendorRating";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const vendor_id = useSelector((state) => state.auth.id);
  console.log("Vendor ID from Redux:", vendor_id);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAllVendors()
      .then((data) => {
        setVendors(data.vendors || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getRating();
  }, []);

  const getRating = async () => {
    try {
      const data = await vendorRating();
      console.log("Response vendor rating:- ", data.formattedVendor);

      const ratingMap = {};
      data.formattedVendor.forEach((vendor) => {
        ratingMap[vendor.id] = {
          average_rating: vendor.average_rating,
          rating_count: vendor.rating_count,
        };
      });

      setRatings(ratingMap);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const handleVendorClick = (id) => {
    navigate(`/vendors/${id}`);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;

      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    const refEl = scrollRef.current;
    if (refEl) {
      refEl.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (refEl) refEl.removeEventListener("scroll", handleScroll);
    };
  }, [vendors]);

  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => {
      // For half stars: if i+0.5 is less than or equal to rating
      const isHalfStar =
        i + 0.5 === Math.floor(rating) + 0.5 && rating % 1 !== 0;
      const isFullStar = i < Math.floor(rating);

      return (
        <div key={i} className="relative inline-block">
          <Star
            size={16}
            className={`${
              isFullStar
                ? "text-yellow-400 fill-yellow-400"
                : isHalfStar
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
          {isHalfStar && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-50">
      <div className="w-full ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 pt-15">
            <span className="inline-block px-3 py-1 text-sm font-medium text-orange-500 bg-orange-100 rounded-full mb-4">
              Discover & Enjoy
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Explore Our <span className="text-orange-500">Vendors</span>
            </h1>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Discover amazing food vendors offering delicious meals and treats
              for every taste and occasion.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-600 font-medium">
                Loading vendors...
              </p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-16 md:py-24 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto border border-gray-100">
              <div className="bg-gray-50 p-6 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                <Store className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No vendors found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We're currently expanding our network. Please check back later
                for exciting new options.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Refresh List
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Featured Vendors
                </h2>
              </div>

              <div className="relative">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`-ml-6 absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full border border-gray-100 hover:bg-orange-50 transition-all ${
                    !canScrollLeft
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-orange-300"
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft
                    className={`w-5 h-5 ${
                      canScrollLeft ? "text-orange-500" : "text-gray-300"
                    }`}
                  />
                </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-5 md:gap-6 pb-8 px-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {vendors.map((vendor) => {
                    const vendorRating = ratings[vendor.id] || {
                      average_rating: 0,
                      rating_count: 0,
                    };

                    return (
                      <div
                        key={vendor.id}
                        onClick={() => handleVendorClick(vendor.id)}
                        className="group w-[280px] sm:w-[320px] flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                      >
                        <div className="relative h-48 sm:h-52 overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_baseUrl}${
                              vendor.image
                            }`}
                            alt={vendor.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/600x400/orange/white?text=Food+Vendor";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {vendor.featured && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors capitalize line-clamp-1">
                              {vendor.name}
                            </h2>
                          </div>

                          <div className="flex items-center mb-3">
                            <div className="flex mr-2 space-x-0.5">
                              {renderStars(vendorRating.average_rating)}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({vendorRating.rating_count || 0})
                            </span>
                          </div>

                          <div className="flex items-center text-gray-500 text-sm mb-4">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-orange-500" />
                            <span className="capitalize truncate">
                              {vendor.address ||
                                "Location available after login"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">
                              View Menu
                            </span>
                            <div className="bg-orange-100 p-1.5 rounded-full group-hover:bg-orange-200 transition-colors">
                              <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full border border-gray-100 hover:bg-orange-50 transition-all ${
                    !canScrollRight
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-orange-300"
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight
                    className={`w-5 h-5 ${
                      canScrollRight ? "text-orange-500" : "text-gray-300"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-center mt-6 md:hidden">
                <div className="flex space-x-1.5">
                  {[...Array(Math.min(5, Math.ceil(vendors.length / 3)))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === 0 ? "w-6 bg-orange-500" : "w-2 bg-gray-300"
                        }`}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
