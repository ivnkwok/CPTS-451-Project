import React from 'react';
import styles from '../../pages/menu/Menu.module.css'
import { FaPlus } from "react-icons/fa6";

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
 * @param {string} [props.nutritionalInfo] - Nutritional information (optional).
 * @param {string} [props.imageUrl] - URL of the menu item's image (optional).
 * @returns {JSX.Element} A styled card representing a menu item.
*/
const MenuItemCard: React.FC<MenuItemProps> = ({
  name,
  price,
  category,
  nutritionalInfo,
  dietaryRestriction,
  imageUrl,
}) => {
  return (
    <div className={styles["menu-item-card"]}>
      <div className={styles["menu-item-image-container"]}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className={styles["menu-item-image"]} />
        ) : (
          <div className={styles["menu-item-placeholder-image"]}>No Available Image</div>
        )}
      </div>
      <div className={styles["menu-item-details"]}>
        <p className={styles["menu-item-category"]}>{category}</p>
        <h3 className={styles["menu-item-name"]}>{name}</h3>
        <p className={styles["menu-item-info"]}>{dietaryRestriction}</p>
        <div className={styles['grid']}>
          <button className={styles["menu-item-add-button"]}>
            <FaPlus /> Add to cart
          </button>
          <p className={styles["menu-item-price"]}>${Number(price).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;