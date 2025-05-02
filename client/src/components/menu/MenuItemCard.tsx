import React, { useState } from "react";
import axios from "../../utils/axios"; // Added this
import styles from "../../pages/menu/Menu.module.css";
import { FaCircleInfo, FaPlus } from "react-icons/fa6";

/**
 * MenuItemProps to enforce type safety.
 */
type MenuItemProps = {
  id: number; // Added this for purchase
  name: string;
  price: number;
  category: string;
  nutritionalInfo?: string;
  dietaryRestriction?: string;
  imageUrl?: string;
  onPurchaseSuccess: (newBalance: number) => void;
};

/**
 * Represents a single menu item card.
 */
const MenuItemCard: React.FC<MenuItemProps> = (props) => {
  const {
    id,
    name,
    price,
    category,
    dietaryRestriction,
    imageUrl,
    nutritionalInfo,
    onPurchaseSuccess,
  } = props;

  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // Success/Failure message

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePurchase = async () => {
    try {
      const res = await axios.post("/users/menu/purchase/", {
        itemId: id,
      });

      setMessage("Purchase successful!");
      onPurchaseSuccess(res.data.new_balance);

      setTimeout(() => {
        setMessage(null);
      }, 2000);

      console.log("Purchase success:", res.data);
    } catch (error: any) {
      console.error("Purchase error:", error);
      setMessage(error.response?.data?.error || "Purchase failed");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const nutritionValues = nutritionalInfo
    ? nutritionalInfo.split(",").map((val) => val.trim())
    : [];
  const [calories, protein, carbs, fats, allergens] = nutritionValues;

  return (
    <div className={styles["menu-item-card"]}>
      {!isFlipped ? (
        <>
          <div className={styles["menu-item-image-container"]}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className={styles["menu-item-image"]}
              />
            ) : (
              <div className={styles["menu-item-placeholder-image"]}>
                No Available Image
              </div>
            )}
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
              <button
                className={styles["menu-item-add-button"]}
                onClick={handlePurchase} // Now buys instead of "Add to cart"
              >
                <FaPlus /> Buy
              </button>
              <p className={styles["menu-item-price"]}>
                ${Number(price).toFixed(2)}
              </p>
            </div>
            <input 
              name="notes"
              placeholder="Enter special instructions..."
              />
            {/* Show success or error message */}
            {message && <p>{message}</p>}
          </div>
        </>
      ) : (
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
