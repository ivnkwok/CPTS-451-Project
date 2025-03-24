import { useEffect, useState } from 'react';
import MenuItemCard from '../../components/menu/MenuItemCard';
import styles from './menu.module.css';
import axios from 'axios';

/**
  * Represents the structure of a menu item.
  * @typedef {Object} MenuItem
  * @property {number} id - Unique identifier of the menu item.
  * @property {string} name - Name of the menu item.
  * @property {number} price - Price of the menu item.
  * @property {string} category - Category of the menu item.
  * @property {string} [nutritional_info] - Nutritional information (optional).
  * @property {string} [image] - URL path to the menu item's image (optional).
*/
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  nutritional_info?: string;
  image?: string;
};

/**
 * Menu component displaying available dining options.
 * Consists of a sidebar with categories and a main section for menu items.
 *
 * @returns {JSX.Element} A structured menu layout with categories and placeholders.
*/
const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Appetizers');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items whenever selectedCategory changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/list/', {
          params: { category: selectedCategory },
        });
        console.log(response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
  
    fetchMenuItems();
  }, [selectedCategory]);
  
  /**
   * Updates the selected category.
   *
   * @param {string} category - The category to filter by.
  */
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles['wrapper']}>
      <div className={styles['two-column-layout']}>
        {/* LEFT COLUMN (Sidebar) */}
        <div className={styles["menu-left"]}>
          <aside className={styles["menu-sidebar"]}>
            <h2 className={styles["menu-title"]}>MENU</h2>
            <p className={styles["menu-tagline breakout"]}>
              Globally inspired flavors, prepared with local love.
            </p>

            <hr/>

            <ul className={styles["menu-categories"]}>
              {['Appetizers', 'Soups & Salads', 'Entrees', 'Sides', 'Desserts', 'Beverages'].map(
                (category) => (
                  <li
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={selectedCategory === category ? styles['active-category'] : ''}
                  >
                    {category}
                  </li>
                )
              )}
            </ul>

            <hr/>

            <p className={styles["menu-note"]}>
              While we offer vegan, vegetarian, and gluten-free dishes, please note that all items
              in our restaurant are prepared in facilities with shared cooking equipment and
              surfaces, and cross-contact with major food allergens may occur.
            </p>

            <button className={styles["allergen-button"]}>View Allergen Guide</button>
          </aside>
        </div>

        {/* RIGHT COLUMN (Main Content) */}
        <div className={styles["menu-right"]}>
          <main className={styles["menu-content"]}>
            <h2 className={styles["category-title"]}>{selectedCategory.toUpperCase()}</h2>
            <div className={styles["menu-items-grid"]}>
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  nutritionalInfo={item.nutritional_info}
                  imageUrl={item.image ? item.image : undefined}
                />
              ))}

              {/* If no items are found, show a placeholder or message */}
              {menuItems.length === 0 && (
                <div className={styles["menu-empty-state"]}>No items found for this category.</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Menu;