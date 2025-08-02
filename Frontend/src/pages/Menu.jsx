import { useEffect, useState } from "react";
import { fetchMenu } from "../services/Home_Menu_api";
import MenuList from "../component/menu/MenuList";
import { useNavigate } from "react-router-dom";
import "../styles/MenuPage_Styles/Menu.css";
import MenuBanner from "../component/menu/MenuBanner";
import { fetchCategories } from "../services/Home_Categories_api";
import Vendors from "../component/menu/Vendors";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu()
      .then((data) => {
        console.log("Fetched menu items: ", data);
        setMenuItems(data.items);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.category || []);
      } catch (error) {
        console.error("Error fetching categories navbar:", error);
      }
    };
    getCategories();
  }, []);

  // **Filter Logic**
  const filteredMenuItems = menuItems.filter((item) => {
    return (
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="menu-page-container">
      <div className="menu-page">
        <MenuBanner />
        <div className="mt-[-110px]"> 
          <Vendors />
        </div>
        <h2 className="menu-page-title">🍔 Cloud Kitchen Menu</h2>
        {/* FILTER SECTION */}
        <div className="menu-filters">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-search-input"
          />

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="menu-category-select"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category._id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        {/* Menu List */}
        <MenuList menuItems={filteredMenuItems} />
      </div>
    </div>
  );
};

export default Menu;
