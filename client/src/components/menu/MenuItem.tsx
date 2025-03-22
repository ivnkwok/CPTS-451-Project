import { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';

interface MenuItemProps {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  onDelete: (id: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  category,
  isAvailable,
  onDelete,
}) => {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="menu-item" style={{ position: 'relative', padding: '1rem', margin: '1rem 0', border: '1px solid var(--clr-primary-200)', borderRadius: '8px' }}>
      <div className="menu-item-content">
        <h3 style={{ color: 'var(--clr-primary-500)', marginBottom: '0.5rem' }}>{name}</h3>
        <p style={{ color: 'var(--clr-primary-400)', marginBottom: '0.5rem' }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--clr-primary-500)', fontWeight: 'bold' }}>${price.toFixed(2)}</span>
          <span style={{ color: isAvailable ? 'var(--clr-primary-300)' : 'var(--clr-primary-error)' }}>
            {isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ backgroundColor: 'var(--clr-primary-200)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
            {category}
          </span>
        </div>
      </div>

      {user?.is_staff && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: 'var(--clr-primary-error)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete Item
          </button>
        </div>
      )}

      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Confirm Deletion</h4>
          <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete {name}?</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={cancelDelete}
              style={{
                backgroundColor: 'var(--clr-primary-200)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              style={{
                backgroundColor: 'var(--clr-primary-error)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem; 