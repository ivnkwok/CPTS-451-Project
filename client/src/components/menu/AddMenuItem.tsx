import React, { useState } from "react";
import axios, { AxiosError } from "axios";

/**
 * A form component to add a new menu item.
 * Users can input item details, including name, price, category, nutritional information, and an image.
 *
 * @component
 * @returns {JSX.Element} A form for adding a menu item.
*/
const AddMenuItemForm = () => {
  /**
   * Type definition for the form data state.
   * @typedef {Object} MenuItemForm
   * @property {string} name - The name of the menu item.
   * @property {string} price - The price of the menu item (stored as a string to match input fields).
   * @property {string} category - The category the menu item belongs to.
   * @property {string} nutritional_info - Nutritional information of the menu item.
   * @property {File | null} image - The image file for the menu item (optional).
  */
  type MenuItemForm = {
    name: string;
    price: string;
    category: string;
    nutritional_info: string;
    image: File | null;
  };

  const [formData, setFormData] = useState<MenuItemForm>({
    name: "",
    price: "",
    category: "",
    nutritional_info: "",
    image: null,
  });

  /**
   * Handles input field changes and updates state.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event.
  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles file input changes and updates the image field in state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
  */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null,
    }));
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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/menu/create/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Menu item added!");
      console.log("Success:", response.data);
    } catch (error: unknown) {
      const err = error as AxiosError;

      if (err.response) {
        console.error("Server responded with:", err.response.data);
        alert(`Failed to add item: ${JSON.stringify(err.response.data)}`);
      } else {
        console.error(
          "Request error:",
          err instanceof Error ? err.message : err
        );
        alert("Failed to add item. See console for details.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-menu-form">
      <input
        name="name"
        placeholder="Item name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        placeholder="Price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        name="nutritional_info"
        placeholder="Nutritional Info"
        value={formData.nutritional_info}
        onChange={handleChange}
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddMenuItemForm;