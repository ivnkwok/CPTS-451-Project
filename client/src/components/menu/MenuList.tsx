import { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { useAuth } from '../../utils/AuthContext';

interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

const MenuList = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu/items/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/menu/items/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      // Update the UI by removing the deleted item
      setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [token]);

  if (error) {
    return (
      <div style={{ color: 'var(--clr-primary-error)', padding: '1rem' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="menu-list" style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--clr-primary-500)' }}>Menu Items</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            category={item.category}
            isAvailable={item.is_available}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList; 