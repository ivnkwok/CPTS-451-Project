import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "./AddMenuItem.module.css";

const categoryOptions = [
  "Appetizers",
  "Soups & Salads",
  "Entrees",
  "Sides",
  "Desserts",
  "Beverages",
];
const dietaryOptions = [
  "None",
  "Vegan",
  "Vegetarian",
  "Halal",
  "Kosher",
  "Gluten-Free",
];

/**
   * Type definition for the form data state.
   * @typedef {Object} MenuItemForm
   * @property {string} name - The name of the menu item.
   * @property {string} price - The price of the menu item (stored as a string to match input fields).
   * @property {string} category - The category the menu item belongs to.
   * @property {string} nutritional_info - Nutritional information of the menu item.
   * @property {string} nutritionalCalories
   * @property {string} nutritionalProtein
   * @property {string} nutritionalCarbs
   * @property {string} nutritionalFats
   * @property {string} nutritionalAllergens
   * @property {string} dietary_restrictions - Dietary restriction tag (e.g., Vegan, Halal).
   * @property {File | null} image - The image file for the menu item (optional).
  */
type MenuItemForm = {
  name: string;
  price: string;
  category: string;
  nutritional_info: string;
  nutritionalCalories: string;
  nutritionalProtein: string;
  nutritionalCarbs: string;
  nutritionalFats: string;
  nutritionalAllergens: string;
  dietary_restrictions: string;
  image: File | null;
};

/**
 * A form component to add a new menu item.
 * Users can input item details, including name, price, category, nutritional information, and an image.
 *
 * @component
 * @returns {JSX.Element} A form for adding a menu item.
*/
const AddMenuItemForm: React.FC = () => {
  const [formData, setFormData] = useState<MenuItemForm>({
    name: "",
    price: "",
    category: "",
    nutritional_info: "",
    nutritionalCalories: "",
    nutritionalProtein: "",
    nutritionalCarbs: "",
    nutritionalFats: "",
    nutritionalAllergens: "",
    dietary_restrictions: "",
    image: null,
  });
  const [error, setError] = useState("");

  /**
   * Handles input field changes and updates state.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event.
  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles file input changes and updates the image field in state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
  */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }));
  };

  /**
   * Handles form submission, sending the form data to the backend API.
   * Uses FormData for multipart file upload.
   *
   * @async
   * @param {React.FormEvent} e - The form submit event.
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Combine nutritional data into one string
    const {
      nutritionalCalories,
      nutritionalProtein,
      nutritionalCarbs,
      nutritionalFats,
      nutritionalAllergens,
    } = formData;
    const combinedNutritional = `${nutritionalCalories} kcal, ${nutritionalProtein}g protein, ${nutritionalCarbs}g carbs, ${nutritionalFats}g fats, allergens: ${nutritionalAllergens}`;

    // Create a new object with the combined nutritional_info
    const payload = new FormData();
    Object.entries({ ...formData, nutritional_info: combinedNutritional }).forEach(
      ([key, value]) => {
        if (value !== null) payload.append(key, value as any);
      }
    );

    try {
      await axios.post(
        "http://localhost:8000/menu/create/",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Menu item added!");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response) {
        setError(JSON.stringify(axiosErr.response.data));
      } else {
        setError(axiosErr.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
      <h2 className={styles.title}>Add New Menu Item</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              className={styles.input}
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroupRow}>
            <input
              className={styles.input}
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select
              className={styles.select}
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Category
              </option>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sectionTitle}>Nutritional Info</div>
          <div className={styles.formGrid}>
            <input
              className={styles.inputSmall}
              name="nutritionalCalories"
              type="number"
              placeholder="Calories"
              value={formData.nutritionalCalories}
              onChange={handleChange}
            />
            <input
              className={styles.inputSmall}
              name="nutritionalProtein"
              type="number"
              placeholder="Protein (g)"
              value={formData.nutritionalProtein}
              onChange={handleChange}
            />
            <input
              className={styles.inputSmall}
              name="nutritionalCarbs"
              type="number"
              placeholder="Carbs (g)"
              value={formData.nutritionalCarbs}
              onChange={handleChange}
            />
            <input
              className={styles.inputSmall}
              name="nutritionalFats"
              type="number"
              placeholder="Fats (g)"
              value={formData.nutritionalFats}
              onChange={handleChange}
            />
            <input
              className={styles.inputSmall}
              name="nutritionalAllergens"
              placeholder="Allergens"
              value={formData.nutritionalAllergens}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <select
              className={styles.select}
              name="dietary_restrictions"
              value={formData.dietary_restrictions}
              onChange={handleChange}
            >
              {dietaryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <input
              className={styles.input}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className={styles.button}>
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemForm;