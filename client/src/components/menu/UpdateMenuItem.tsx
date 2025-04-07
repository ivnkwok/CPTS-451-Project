import React, { useState, useEffect } from "react";
import axios from "axios";

type MenuItem = {
    id: number;
    name: string;
    price: number;
    category: string;
    nutritional_info?: string;
    dietary_restrictions?: string;
    image?: string;
};



const MenuItems: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/menu/list/", {
        });
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

  if (loading) {
    fetchMenuItems()
    setLoading(false)
    return <p>Loading menu items...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const target = e.currentTarget;
    const data: Record<string, string> = {};

    Array.from(target.children).forEach((child, index) => {
      console.log(child)
      if (child instanceof HTMLInputElement) {
        data[`item${index}`] = child.value || "";
      }
    });
    console.log(data)

    try {
      const response = await axios.post(
        "http://localhost:8000/menu/create/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Menu item added!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add item.");
    }
  };

//   if (error) {
//     return <p>{error}</p>;
//   }

  return (
    <div>
      <ul>
        {menuItems.map((item) => (
          <form onSubmit={handleSubmit} className="add-menu-form">
          <input
            name="name"
            placeholder = "Name"
            value={item.name}
            // onChange={handleChange}
            required
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={item.price}
            // onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={item.category}
            // onChange={handleChange}
            required
          />
          <input
            name="nutritional_info"
            placeholder="Nutritional Info"
            value={item.nutritional_info}
            // onChange={handleChange}
          />
          <img
            alt = "image"
            src = {item.image ? item.image : undefined}
            />
          <input 
            type="file" 
            name="image"
            // onChange={handleFileChange}
          />
          <button type="submit">Update Item</button>
          <button type="submit">Delete Item</button>
        </form>
        ))}
      </ul>
    </div>
  );
};

export default MenuItems;