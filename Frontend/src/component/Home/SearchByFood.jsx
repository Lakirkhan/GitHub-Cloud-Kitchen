import React, { useState, useEffect, useRef } from "react";
import "../../styles/Home_Styles/Home.css";
import { fetchCategories } from "../../services/Home_Categories_api";
import { useNavigate } from "react-router-dom";

const SearchByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        const fetchedCategories = data.category || [];
        setCategories([...fetchedCategories, ...fetchedCategories]);
        console.log("Fetched Categories: ", fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const scrollCarousel = () => {
      if (scrollRef.current) {
        let maxScroll = scrollRef.current.scrollWidth / 2;

        scrollRef.current.scrollLeft += 1.5;

        if (scrollRef.current.scrollLeft >= maxScroll) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      requestRef.current = requestAnimationFrame(scrollCarousel);
    };

    requestRef.current = requestAnimationFrame(scrollCarousel);

    return () => cancelAnimationFrame(requestRef.current);
  }, [categories]);

  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/menu/${id}`);
  };

  return (
    <div className="search-food-section">
      <h2 className="hm-section-title">Search by Category</h2>

      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      <div className="food-carousel-container">
        <div className="food-carousel" ref={scrollRef}>
          {categories.length > 0
            ? categories.map((category, index) => (
                <div
                  key={index}
                  className="food-card-Search"
                  onClick={() => handleClick(category.id)}
                >
                  <img
                    src={`${import.meta.env.VITE_baseUrl}${category.category_image}`}
                    alt={category.category_name}
                    className="food-image-Search"
                  />
                </div>
              ))
            : !loading && <p>No categories available.</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchByCategory;
