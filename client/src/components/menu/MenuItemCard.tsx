import React from 'react';
import styles from '../../pages/menu/Menu.module.css'
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useAuth } from '../../utils/AuthContext';
import axios from 'axios';

type MenuItemProps = {
  id: number;
  name: string;
  price: number;
  category: string;
  nutritionalInfo?: string;
  dietaryRestriction?: string;
  imageUrl?: string;
  onDelete?: () => void;
};

/**
 * Represents a single menu item card.
 * Displays the item's name, price, category, optional nutritional information, and an image.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.id - The unique identifier of the menu item.
 * @param {string} props.name - The name of the menu item.
 * @param {number} props.price - The price of the menu item.
 * @param {string} props.category - The category of the menu item.
 * @param {string} [props.nutritionalInfo] - Nutritional information (optional).
 * @param {string} [props.imageUrl] - URL of the menu item's image (optional).
 * @param {() => void} [props.onDelete] - Callback function when item is deleted.
 * @returns {JSX.Element} A styled card representing a menu item.
*/
const MenuItemCard: React.FC<MenuItemProps> = ({
  id,
  name,
  price,
  category,
  nutritionalInfo,
  dietaryRestriction,
  imageUrl,
  onDelete,
}) => {
  const { user } = useAuth();
  const isStaff = user?.email?.endsWith('@dininghall.com'); // Simple staff check based on email domain

  const handleDelete = async () => {
    if (!isStaff) return;
    
    try {
      await axios.delete(`http://localhost:8000/menu/delete/${id}/`);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    }
  };

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
          <div className={styles["menu-item-actions"]}>
            <p className={styles["menu-item-price"]}>${Number(price).toFixed(2)}</p>
            {isStaff && (
              <button 
                className={styles["menu-item-delete-button"]}
                onClick={handleDelete}
                title="Delete item"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;