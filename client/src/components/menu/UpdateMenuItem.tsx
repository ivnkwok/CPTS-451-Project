import React, { useState, useEffect, useCallback } from "react";
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

const [imageFile, setImageFile] = useState<File>() 
const [imageURL, setImageURL] = useState<string>()

const updateMenuItem = async (menuItem: MenuItem) => {
  const api = `http://localhost:8000/menu/item/${menuItem.id}/`
  try {
    console.log(menuItem)
    const res = await axios.put(api, menuItem)
    return res.data
  }
  catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
}

const MenuItems: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = useCallback(async () => {
    try {
        const response = await axios.get("http://localhost:8000/menu/list/");
        setMenuItems(response.data);
    } catch (error) {
        console.error("Error fetching menu items:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  if (loading) {
    fetchMenuItems()
    setLoading(false)
    return <p>Loading menu items...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget

    const dataDiv = form.querySelector('div[data-id]') as HTMLFormElement
    const inputs = form.querySelectorAll('input')
    const imageTag = form.querySelector('img[alt="image"]') as HTMLImageElement

    console.log(imageTag)

    const menuItem: MenuItem = {
        id: dataDiv ? parseInt(dataDiv.dataset.id || '0') : 0,
        name: '',
        price: 0,
        category: ''
      };

      inputs.forEach(input => {
        const value = input.value || input.placeholder;
      
        switch (input.name) {
          case 'name':
            menuItem.name = value;
            break;
          case 'price':
            menuItem.price = parseFloat(value);
            break;
          case 'category':
            menuItem.category = value;
            break;
          case 'nutritional_info':
            menuItem.nutritional_info = value;
            break;
          case 'image':
            //skip
            break;
        }
      });

      if (imageTag?.src) {
        menuItem.image = imageTag.src
      }

      updateMenuItem(menuItem)
  };

//   if (error) {
//     return <p>{error}</p>;
//   }

  return (
    <div>
      <ul>
        {menuItems.map((item) => (
          <form onSubmit={handleSubmit} className="add-menu-form">
          <div data-id ={item.id}></div>
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