import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// --- Configuration ---
// Replace with your actual API base URL if it's different
const API_BASE_URL = 'http://localhost:8000'; // Example: 'http://localhost:8000/api' if served separately

// --- TypeScript Interfaces ---
// Matches the structure from your Django MenuItem model and serializer
interface MenuItem {
    id: number;
    name: string;
    price: string; // Keep as string for input handling, convert on submit
    category: string;
    nutritional_info: string;
    dietary_restrictions: string;
    image: string | null; // URL to the image
    times_bought: number;
    // Add other fields from your model if needed
}

// Interface for the data sent during update (might be a subset)
interface MenuItemUpdateData {
    name: string;
    price: string;
    category: string;
    nutritional_info: string;
    dietary_restrictions: string;
    // Note: Image update usually requires FormData, not included here
}

// --- React Component ---
const MenuManager: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<MenuItemUpdateData>({
        name: '',
        price: '',
        category: '',
        nutritional_info: '',
        dietary_restrictions: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    // --- Fetch Menu Items ---
    const fetchMenuItems = async () => {
        setIsLoading(true);
        setError(null);
        setUpdateSuccess(null); // Clear previous success message
        try {
            const response = await fetch(`${API_BASE_URL}/menu/list/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: MenuItem[] = await response.json();
            setMenuItems(data);
        } catch (err: any) {
            setError(`Failed to fetch menu items: ${err.message}`);
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch items on component mount
    useEffect(() => {
        fetchMenuItems();
    }, []); // Empty dependency array means run once on mount

    // --- Form Handling ---

    // Handle selecting an item to edit
    const handleSelectItem = (item: MenuItem) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            price: String(item.price), // Ensure price is string for input value
            category: item.category,
            nutritional_info: item.nutritional_info || '', // Handle potential null/undefined
            dietary_restrictions: item.dietary_restrictions || '', // Handle potential null/undefined
        });
        setError(null); // Clear errors when selecting a new item
        setUpdateSuccess(null); // Clear success message
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to form
    };

    // Handle input changes in the form
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNutritionalInfo = (info:string) => {
        let labels = ["Calories: ", "Proteins: ", "Carbs: ", "Fats: "]
        let splitInfo = info.split(",")
        let out = ""
        for (let i = 0; i < labels.length; i++) {
            out += `${labels[i] + splitInfo[i].trim()},`
        }
        return out;
    }

    // Handle form submission (Update)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedItem) {
            setError('No item selected for update.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setUpdateSuccess(null);

        // Basic validation (example)
        if (!formData.name.trim()) {
            setError("Name cannot be empty.");
            setIsLoading(false);
            return;
        }
        const priceNum = parseFloat(formData.price);
        if (isNaN(priceNum) || priceNum < 0) {
             setError("Invalid price. Must be a non-negative number.");
             setIsLoading(false);
             return;
        }

        // Prepare data for PUT request (matching Django view expectations)
        const updateData: Partial<MenuItemUpdateData> = {
            ...formData,
            price: priceNum.toFixed(2) // Send price as a formatted string or number, check backend
        };


        try {
            const response = await fetch(
                `${API_BASE_URL}/menu/${selectedItem.id}/update/`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // --- IMPORTANT ---
                        // Add Authentication headers if required by your API
                        // e.g., 'Authorization': `Bearer ${yourAuthToken}`
                        // Add CSRF token header if needed (e.g., 'X-CSRFToken': getCookie('csrftoken'))
                    },
                    body: JSON.stringify(updateData),
                }
            );

            // Check for non-JSON or error responses first
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json(); // Try to parse error details from backend
                    errorMsg = errorData.error || errorData.detail || (errorData.errors ? JSON.stringify(errorData.errors) : errorMsg);
                } catch (jsonError) {
                    // Backend didn't return JSON error details
                    console.error("Could not parse error response:", jsonError);
                }
                 throw new Error(errorMsg);
            }

            // Handle successful update (assuming backend returns updated item or success message)
            const result = await response.json(); // Assuming backend sends back JSON
            setUpdateSuccess(result.message || 'Item updated successfully!'); // Use message from backend if available

            // Refresh the list to show updated data
            fetchMenuItems();

            // Clear the form
            setSelectedItem(null);
            setFormData({ name: '', price: '', category: '', nutritional_info: '', dietary_restrictions: '' });

        } catch (err: any) {
            setError(`Failed to update menu item: ${err.message}`);
            console.error("Update error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancelling the edit
    const handleCancelEdit = () => {
        setSelectedItem(null);
        setError(null);
        setUpdateSuccess(null);
         setFormData({ name: '', price: '', category: '', nutritional_info: '', dietary_restrictions: '' });
    };

    // --- Rendering ---
    return (
        <div style={styles.container}>
            <h2>Menu Items</h2>

            {/* Loading Indicator */}
            {isLoading && <p>Loading...</p>}

             {/* General Error Display */}
             {error && !selectedItem && <p style={styles.errorText}>Error: {error}</p>} {/* Show general errors only if not editing */}
             {updateSuccess && <p style={styles.successText}>{updateSuccess}</p>}


            {/* Menu Item List */}
            {!isLoading && !error && ( // Only show list if not loading and no initial fetch error
                <ul style={styles.list}>
                    {menuItems.length === 0 && <p>No menu items found.</p>}
                    {menuItems.map((item) => (
                        <li key={item.id} style={styles.listItem}>
                            <div style={styles.itemDetails}>
                                {item.image && <img src={item.image} alt={item.name} style={styles.itemImage} />}
                                <div>
                                    <strong>{item.name}</strong> (${item.price}) - {item.category}
                                    <br />
                                    <small>Dietary: {item.dietary_restrictions || 'None'}</small>
                                    <br />
                                    <small>Nutrition: {handleNutritionalInfo(item.nutritional_info) || 'N/A'}</small>
                                    <br/>
                                     <small>Times Bought: {item.times_bought}</small>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSelectItem(item)}
                                disabled={isLoading}
                                style={styles.editButton}
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Update Form */}
            {selectedItem && (
                <div style={styles.formContainer}>
                    <h3>Edit: {selectedItem.name}</h3>
                     {/* Form-specific Error Display */}
                     {error && <p style={styles.errorText}>Error: {error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="price">Price ($):</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                step="0.01" // Allows decimal input
                                min="0" // Prevents negative numbers
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="nutritional_info">Nutritional Info:</label>
                            <textarea
                                id="nutritional_info"
                                name="nutritional_info"
                                value={formData.nutritional_info}
                                onChange={handleInputChange}
                                style={styles.textarea}
                            />
                        </div>
                         <div style={styles.formGroup}>
                            <label htmlFor="dietary_restrictions">Dietary Restrictions:</label>
                            <input
                                type="text"
                                id="dietary_restrictions"
                                name="dietary_restrictions"
                                value={formData.dietary_restrictions}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                        </div>
                        {/* Add other fields as needed */}

                        <div style={styles.buttonGroup}>
                             <button type="submit" disabled={isLoading} style={styles.submitButton}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                             <button type="button" onClick={handleCancelEdit} disabled={isLoading} style={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// --- Basic Styling (Inline for simplicity) ---
// Consider using CSS modules or a styling library for larger applications
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemDetails: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    itemImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '4px',
        border: '1px solid #eee',
    },
    editButton: {
        padding: '8px 15px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    formContainer: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '20px',
        marginTop: '30px',
        backgroundColor: '#f9f9f9',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box', // Prevents padding from expanding width
    },
    textarea: {
         width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        minHeight: '80px',
    },
     buttonGroup: {
        display: 'flex',
        gap: '10px', // Adds space between buttons
        marginTop: '20px',
    },
    submitButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    cancelButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: '15px', // Add space below error messages
    },
     successText: {
        color: 'green',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
};

export default MenuManager;