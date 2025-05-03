// src/components/DeleteMenuItems.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCSRFToken } from "../../utils/csrf";

type MenuItem = { id: number; name: string; price: string; };

export const DeleteMenuItems: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ results: MenuItem[] }>("http://localhost:8000/menu/list/")
      .then(res => {
        const data = res.data;
        const arr = Array.isArray(data)
          ? data
          : data.results || [];
        setItems(arr);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load menu items");
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const csrfToken = await getCSRFToken();
      const res = await fetch(`http://localhost:8000/menu/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRFToken': csrfToken },
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Deletion failed');
      }
    } catch (err: any) {
      console.error('Network error:', err);
      setError('Network error during deletion');
    }
  };

  return (
    <div>
      <h2>Delete Menu Items</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {Array.isArray(items) ? (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} (${item.price})
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items to display.</p>
      )}
    </div>
  );
};
