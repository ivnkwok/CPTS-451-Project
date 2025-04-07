import React, { useState } from 'react';
import styles from '../../pages/menu/Menu.module.css'
import { FaCircleInfo, FaPlus } from "react-icons/fa6";

/**
 * MenuItemProps to enforce type safety.
 */
type MenuItemProps = {
  name: string;
  price: number;
  category: string;
  nutritionalInfo?: string;
  dietaryRestriction?: string;
  imageUrl?: string;
};

/**
 * Represents a single menu item card.
 * Displays the item's name, price, category, optional nutritional information, and an image.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the menu item.
 * @param {number} props.price - The price of the menu item.
 * @param {string} props.category - The category of the menu item.
 * @param {string} [props.imageUrl] - URL of the menu item's image (optional).
 * @returns {JSX.Element} A styled card representing a menu item.
*/
const MenuItemCard: React.FC<MenuItemProps> = (props) => {
  const {
    name,
    price,
    category,
    dietaryRestriction,
    imageUrl,
    nutritionalInfo,
  } = props;

  /**
   * State to track if the card is flipped
  */
  const [isFlipped, setIsFlipped] = useState(false);

  /**
   * Boolean flag that handles what side the card is on.
   */
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Split the combined nutritional_info string into an array
  const nutritionValues = nutritionalInfo ? nutritionalInfo.split(',').map(val => val.trim()) : [];
  const [calories, protein, carbs, fats, allergens] = nutritionValues;

  return (
    <div className={styles["menu-item-card"]}>
      {/* If not flipped, show front */}
      {!isFlipped ? (
        <>
          <div className={styles["menu-item-image-container"]}>
            {imageUrl ? (
              <img src={imageUrl} alt={name} className={styles["menu-item-image"]} />
            ) : (
              <div className={styles["menu-item-placeholder-image"]}>
                No Available Image
              </div>
            )}
            {/* Moved the info button into the image container */}
            <button
              onClick={handleFlip}
              className={styles["info-button"]}
              aria-label="Show nutrition info"
              title="Show nutrition info"
            >
              <FaCircleInfo />
            </button>
          </div>
          <div className={styles["menu-item-details"]}>
            <p className={styles["menu-item-category"]}>{category}</p>
            <h3 className={styles["menu-item-name"]}>{name}</h3>
            <p className={styles["menu-item-info"]}>{dietaryRestriction}</p>
            <div className={styles["grid"]}>
              <button className={styles["menu-item-add-button"]}>
                <FaPlus /> Add to cart
              </button>
              <p className={styles["menu-item-price"]}>
                ${Number(price).toFixed(2)}
              </p>
            </div>
          </div>
        </>
      ) : (
        // Card back with nutritional info
        <div className={styles["menu-item-details"]}>
          <h3 className={styles["menu-item-name"]}>Nutrition Facts</h3>
          {nutritionalInfo ? (
            <>
              <p>Calories: {calories || "N/A"}</p>
              <p>Protein: {protein || "N/A"} g</p>
              <p>Carbs: {carbs || "N/A"} g</p>
              <p>Fats: {fats || "N/A"} g</p>
              <p>Allergens: {allergens || "None"}</p>
            </>
          ) : (
            <p>No detailed nutrition info available.</p>
          )}
          <button
            onClick={handleFlip}
            aria-label="Flip back to main info"
            title="Flip to main info"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;