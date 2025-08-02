import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMenu } from "../services/Home_Menu_api";
import { addToCartApi } from "../services/Cart_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Desciption_page/MenuItemDetails.css";
import { ArrowLeft, Share2, Star } from "lucide-react";
import { fetchItemsByCategoryIdApi } from "../services/Home_Categories_api";
import { RatingApi } from "../services/Reviews";

const MenuItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchMenu()
      .then((data) => {
        const selectedItem = data.items.find(
          (item) => item.id === Number.parseInt(itemId)
        );
        setItem(selectedItem);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching item details:", error);
        setLoading(false);
        toast.error("Failed to load item details", {
          position: "top-center",
          closeOnClick: true,
          autoClose: 1000,
        });
      });
  }, [itemId]);

  useEffect(() => {
    if (item && item.categoryId) {
      fetchRelatedItems(item.categoryId);
    }
  }, [item]);

  const fetchRelatedItems = async (categoryId) => {
    if (!categoryId) return;

    try {
      const response = await fetchItemsByCategoryIdApi(categoryId);
      console.log("Fetched related items by category: ", response.items);

      if (response && response.status === "success" && response.items) {
        // Exclude the current item from related items
        const filteredItems = response.items.filter(
          (relatedItem) => relatedItem.id !== Number.parseInt(itemId)
        );
        setRelatedItems(filteredItems);
      } else {
        console.error("Invalid response format for related items:", response);
        setRelatedItems([]);
      }
    } catch (error) {
      console.error("Error fetching related items:", error);
      setRelatedItems([]); // Reset related items on error
    }
  };

  const handleAddToCart = async () => {
    if (!item) return;

    try {
      // Add quantity to the item before sending to API
      const itemWithQuantity = { ...item, quantity };
      const response = await addToCartApi(itemWithQuantity);

      if (response.status === "success") {
        toast.success(
          `${quantity} ${quantity > 1 ? "items" : "item"} added to cart!`,
          {
            position: "top-center",
            closeOnClick: true,
            autoClose: 1000,
          }
        );
        console.log("Added to cart:", itemWithQuantity);
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      {
        position: "top-center",
        closeOnClick: true,
        autoClose: 1000,
      }
    );
  };

  const shareItem = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item?.name,
          text: `Check out ${item?.name} on our menu!`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        position: "top-center",
        closeOnClick: true,
        autoClose: 1000,
      });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      toast.error("Please select a rating", {
        position: "top-center",
        closeOnClick: true,
        autoClose: 1000,
      });
      return;
    }

    try {
      // Use the RatingApi to submit the rating to the backend
      const response = await RatingApi(Number.parseInt(itemId), userRating);
      console.log("Rating response:", response);

      if (response && response.status === "success") {
        // Add the new review to the reviews array
        const newReview = {
          id: Date.now(), // Temporary ID
          user_name: "You", // You might want to get the actual user name
          rating: userRating,
          comment: userReview,
          date: new Date().toISOString(),
        };
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setUserReview("");
        toast.success("Review submitted successfully!", {
          position: "top-center",
          closeOnClick: true,
          autoClose: 1000,
        });
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review", {
        position: "top-center",
        closeOnClick: true,
        autoClose: 1000,
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-container">
        <h2>Item not found</h2>
        <p>Sorry, we couldn't find the menu item you're looking for.</p>
        <Link to="/menu" className="back-button">
          <ArrowLeft size={16} />
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="ds-menu-item-container">
      <div className="ds-menu-item-wrapper">
        <div className="ds-menu-item-header">
          <Link to="/menu" className="ds-back-button">
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
          <div className="ds-action-buttons">
            <button
              className="ds-share-button"
              onClick={shareItem}
              aria-label="Share this item"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="ds-menu-item-card">
          <div>
            <div className="ds-menu-item-image-container">
              <img
                src={`${import.meta.env.VITE_baseUrl}${item.image}`}
                alt={item.name}
                className="ds-menu-item-image"
              />
            </div>
          </div>
          <div className="ds-menu-item-info">
            <h1 className="ds-menu-item-title capitalize">{item.name}</h1>
            <span className=" font-medium w-fit px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full ">
              {item.tbl_vendor?.name || "Unknown"}
            </span>

            <div className="ds-menu-item-tabs">
              <button
                className={`ds-tab ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              {/* <button
                className={`ds-tab ${activeTab === "related" ? "active" : ""}`}
                onClick={() => setActiveTab("related")}
              >
                Related Items
              </button> */}
              <button
                className={`ds-tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <div className="ds-tab-content">
              {activeTab === "description" && (
                <div className="ds-description-content">
                  <p className="ds-menu-item-description">{item.description}</p>
                  <div className="ds-ingredients">
                    <h3>Ingredients</h3>
                    <p>Premium ingredients sourced from local farms.</p>
                  </div>
                </div>
              )}

              {activeTab === "related" && (
                <div className="ds-related-content">
                  <h3>You might also like</h3>
                  <div className="ds-related-items">
                    {relatedItems.length > 0 ? (
                      relatedItems.map((relItem) => (
                        <div key={relItem.id} className="ds-related-item">
                          <img
                            src={`${import.meta.env.VITE_baseUrl}${
                              relItem.image
                            }`}
                            alt={relItem.name}
                            className="ds-related-item-image"
                          />
                          <div className="ds-related-item-info">
                            <h4>{relItem.name}</h4>
                            <p>₹{relItem.price}</p>
                            <Link
                              to={`/menu/${relItem.id}`}
                              className="ds-related-item-link"
                            >
                              View Item
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No related items found.</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-content">
                  <h3>Customer Reviews</h3>

                  <div className="review-form">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div className="rating-selector">
                        <p>Your Rating:</p>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className={`star-button ${
                                userRating >= star ? "active" : ""
                              }`}
                            >
                              <Star
                                fill={userRating >= star ? "#ff5722" : "none"}
                                stroke={userRating >= star ? "#ff5722" : "#666"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Share your experience with this item (optional)"
                        className="review-textarea"
                      ></textarea>
                      <button type="submit" className="submit-review-btn">
                        Submit Review
                      </button>
                    </form>
                  </div>

                  <div className="reviews-list">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <span className="reviewer-name">
                              {review.user_name}
                            </span>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < review.rating ? "#ff5722" : "none"}
                                  stroke={
                                    i < review.rating ? "#ff5722" : "#666"
                                  }
                                />
                              ))}
                            </div>
                            <span className="review-date">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="review-comment">{review.comment}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-reviews">
                        No reviews yet. Be the first to review!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="ds-menu-item-purchase">
              <div className="ds-price-container">
                <p className="ds-menu-item-price">₹{item.price}</p>
                <p className="ds-menu-item-original-price">
                  ₹{Math.round(item.price * 1.1)}
                </p>
              </div>
            </div>

            <button className="ds-menu-item-add-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MenuItemDetails;
