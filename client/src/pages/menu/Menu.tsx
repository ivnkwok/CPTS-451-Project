import { useEffect, useState } from "react";
import MenuItemCard from "../../components/menu/MenuItemCard";
import styles from "./menu.module.css";
import axios from "../../utils/axios";
import { FaFilter, FaXmark } from "react-icons/fa6";
import BalanceDisplay from "../../components/balance/BalanceDisplay";
import TopUpForm from "../../components/balance/TopUpForm";
import { useAuth } from "../../context/AuthContext";

/**
 * Represents the structure of a menu item.
 * @typedef {Object} MenuItem
 * @property {number} id - Unique identifier of the menu item.
 * @property {string} name - Name of the menu item.
 * @property {number} price - Price of the menu item.
 * @property {string} category - Category of the menu item.
 * @property {string} [nutritional_info] - Nutritional information (optional).
 * @property {string} [dietary_restrictions] - Dietary restriction (optional).
 * @property {string} [image] - URL path to the menu item's image (optional).
 */
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  nutritional_info?: string;
  dietary_restrictions?: string;
  image?: string;
};

/**
 * Menu component displaying available dining options.
 * Consists of a sidebar with categories and a main section for menu items.
 *
 * @returns {JSX.Element} A structured menu layout with categories and placeholders.
 */
const Menu = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Appetizers");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [dietary, setDietary] = useState<string>("");
  const { user, isLoading } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get("/users/balance/");

        setBalance(Number(res.data.amount));
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    if (!isLoading && user) {
      fetchBalance();
    }
  }, [isLoading, user]);

  // Fetch menu items whenever selectedCategory changes or filter changes
  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async (filters?: any) => {
    try {
      // We can pass filters or default to current states
      const params = {
        category: selectedCategory,
        ...(filters || {}),
      };
      const response = await axios.get("/menu/list/", { params });

      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  /**
   * Updates the selected category.
   *
   * @param {string} category - The category to filter by.
   */
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setMinPrice("");
    setMaxPrice("");
    setDietary("");
  };

  // Called when user clicks "Search" in the filter panel
  const handleFilterSearch = () => {
    const filters = {
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      dietary: dietary || undefined,
    };
    fetchMenuItems(filters);
  };

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["two-column-layout"]}>
        {/* LEFT COLUMN (Sidebar) */}
        <div className={styles["menu-left"]}>
          <aside className={styles["menu-sidebar"]}>
            <h2 className={styles["menu-title"]}>MENU</h2>

            {user && (
              <div style={{ padding: "1rem 0" }}>
                <BalanceDisplay balance={balance} />
                <TopUpForm onTopUpSuccess={setBalance} />
              </div>
            )}

            <p className={styles["menu-tagline breakout"]}>
              Globally inspired flavors, prepared with local love.
            </p>

            <hr />

            <ul className={styles["menu-categories"]}>
              {[
                "Appetizers",
                "Soups & Salads",
                "Entrees",
                "Sides",
                "Desserts",
                "Beverages",
              ].map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={
                    selectedCategory === category
                      ? styles["active-category"]
                      : ""
                  }
                >
                  {category}
                </li>
              ))}
            </ul>

            <hr />

            <p className={styles["menu-note"]}>
              While we offer vegan, vegetarian, and gluten-free dishes, please
              note that all items in our restaurant are prepared in facilities
              with shared cooking equipment and surfaces, and cross-contact with
              major food allergens may occur.
            </p>

            <button className={styles["button"]}>View Allergen Guide</button>
          </aside>
        </div>

        {/* RIGHT COLUMN (Main Content) */}
        <div className={styles["menu-right"]}>
          <main className={styles["menu-content"]}>
            {/* Header row with category title and filter icon/button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className={styles["category-title"]}>
                {selectedCategory.toUpperCase()}
              </h2>
              <button onClick={() => setShowFilterPanel(!showFilterPanel)}>
                {showFilterPanel ? (
                  <FaXmark
                    aria-label="Close menu filter option button."
                    title="Close filter button."
                  />
                ) : (
                  <FaFilter
                    aria-label="Open menu filter option button."
                    title="Open filter button."
                  />
                )}
              </button>
            </div>

            {/* Filter panel */}
            {showFilterPanel && (
              <div className={styles["filter-panel"]}>
                <h3
                  style={{
                    paddingBottom: "1rem",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Filter Options
                </h3>
                <div className={styles["filter-row"]}>
                  <div className={styles["filter-group"]}>
                    <label
                      className={styles["filter-label"]}
                      htmlFor="minPrice"
                    >
                      Min Price
                    </label>
                    <input
                      id="minPrice"
                      name="minPrice"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className={styles["filter-group"]}>
                    <label
                      className={styles["filter-label"]}
                      htmlFor="maxPrice"
                    >
                      Max Price
                    </label>
                    <input
                      id="maxPrice"
                      name="maxPrice"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div className={styles["filter-group"]}>
                    <label className={styles["filter-label"]} htmlFor="dietary">
                      Dietary Restriction
                    </label>
                    <select
                      id="dietary"
                      name="dietary"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                    >
                      <option value="">--None--</option>
                      <option value="Halal">Halal</option>
                      <option value="Kosher">Kosher</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Keto">Keto</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Gluten-Free">Gluten Free</option>
                    </select>
                  </div>
                </div>

                <button
                  className={styles["button"]}
                  onClick={handleFilterSearch}
                >
                  Search
                </button>
              </div>
            )}

            <div className={styles["menu-items-grid"]}>
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  nutritionalInfo={item.nutritional_info}
                  dietaryRestriction={item.dietary_restrictions}
                  imageUrl={item.image ? item.image : undefined}
                />
              ))}

              {menuItems.length === 0 && (
                <div className={styles["menu-empty-state"]}>
                  No items found for this category or filter.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Menu;
