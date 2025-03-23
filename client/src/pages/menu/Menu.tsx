import './Menu.css'

/**
 * Menu component displaying available dining options.
 * Consists of a sidebar with categories and a main section for menu items.
 *
 * @returns {JSX.Element} A structured menu layout with categories and placeholders.
 */
const Menu = () => {
  return (
    <div className='wrapper'>
      <div className='two-column-layout'>
        {/* LEFT COLUMN (Sidebar) */}
        <div className="menu-left">
          <aside className="menu-sidebar">
            <h2 className="menu-title">MENU</h2>
            <p className="menu-tagline breakout">
              Globally inspired flavors, prepared with local love.
            </p>

            <hr/>

            <ul className="menu-categories">
              <li>Appetizers</li>
              <li>Soups & Salads</li>
              <li>Entrees</li>
              <li>Sides</li>
              <li>Desserts</li>
              <li>Beverages</li>
            </ul>

            <hr/>

            <p className="menu-note">
              While we offer vegan, vegetarian, and gluten-free dishes, please note that all items
              in our restaurant are prepared in facilities with shared cooking equipment and
              surfaces, and cross-contact with major food allergens may occur.
            </p>

            <button className="allergen-button">View Allergen Guide</button>
          </aside>
        </div>

        {/* RIGHT COLUMN (Main Content) */}
        <div className="menu-right">
          <main className="menu-content">
            <h2 className="category-title">APPETIZERS</h2>
            <div className="menu-items-grid">
              {/* Placeholder items—replace with dynamic content later */}
              <div className="menu-item-placeholder" />
              <div className="menu-item-placeholder" />
              <div className="menu-item-placeholder" />
              <div className="menu-item-placeholder" />
              <div className="menu-item-placeholder" />
              <div className="menu-item-placeholder" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Menu