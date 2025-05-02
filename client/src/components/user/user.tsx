import React, {useState, useEffect, useCallback} from 'react';


interface User {
    id: number | string;
    username: string;
    email?: string | null;
    groups?: string[];
    is_staff?: boolean;
    is_superuser?: boolean;
  }

  interface UserApiResponse {
    users: User[];
  }

  const API_BASE_URL = 'http://localhost:8000';

  const API_LIST_USERS_URL = `${API_BASE_URL}/users/list`;
  const API_DELETE_USER_BASE_URL = `${API_BASE_URL}/users/`;
  console.log(API_LIST_USERS_URL)
  const UserManagement: React.FC = () => {
    // State variables
    const [users, setUsers] = useState<User[]>([]); // Holds the list of users
    const [isLoading, setIsLoading] = useState<boolean>(true); // Tracks loading state
    const [error, setError] = useState<string | null>(null); // Holds error messages
  
    // --- Fetch Users Function ---
    const fetchUsers = useCallback(async () => {
      setIsLoading(true);
      setError(null); // Reset error before fetching
  
      try {
        // IMPORTANT: Add appropriate headers if authentication/CSRF is needed
        const response = await fetch(API_LIST_USERS_URL, {
          method: 'GET',
        });
  
        if (!response.ok) {
          // Attempt to parse error message from backend, otherwise use status text
          let errorMsg = `HTTP error! Status: ${response.status}`;
          try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorData.detail || errorMsg; // Common Django error fields
          } catch (parseError) {
              // Ignore if response body is not JSON or empty
          }
          throw new Error(errorMsg);
        }
  
        const data: UserApiResponse = await response.json();
        setUsers(data.users || []); // Update state with fetched users
  
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching users.');
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    }, []);

    useEffect(() => {
        fetchUsers();
      }, [fetchUsers]);

      const handleDelete = async (userId: number | string, username: string) => {
        // Confirmation dialog
        if (!window.confirm(`Are you sure you want to delete user "${username}" (ID: ${userId})?`)) {
          return; // Abort if user cancels
        }
    
        setError(null); // Clear previous errors
    
        try {
          const deleteUrl = `${API_DELETE_USER_BASE_URL}${userId}/delete/`; // Construct the specific delete URL
    
          // IMPORTANT: Add appropriate headers if authentication/CSRF is needed
          const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              // Add CSRF token header if required
              // 'X-CSRFToken': getCookie('csrftoken') || '',
            },
          });
    
          if (!response.ok) {
             // Attempt to parse error message from backend
             let errorMsg = `HTTP error! Status: ${response.status}`;
             try {
                 const errorData = await response.json();
                 errorMsg = errorData.error || errorData.detail || errorMsg;
             } catch (parseError) {
                 // Ignore if response body is not JSON or empty
             }
             throw new Error(errorMsg);
          }
    
          // On successful deletion, filter out the deleted user from the local state
          setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
          // Optionally show a success message (e.g., using a toast library)
          console.log(`User ${userId} deleted successfully.`);
    
        } catch (err) {
          console.error(`Error deleting user ${userId}:`, err);
          setError(err instanceof Error ? err.message : `An unknown error occurred while deleting user ${userId}.`);
          // Optionally show an error message to the user
          alert(`Failed to delete user: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      };

      return (
        <div className="container mx-auto p-4 md:p-6 font-sans">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">User Management</h1> {/* Title updated slightly */}
    
          {/* Loading Indicator */}
          {isLoading && <div className="text-center text-gray-600 py-4">Loading users...</div>}
    
          {/* Error Message Display */}
          {error && <div className="text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md mb-4">{error}</div>}
    
          {/* User Table - Only render if not loading and no critical fetch error */}
          {!isLoading && !error && (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto"> {/* Added overflow-x-auto for smaller screens */}
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-4 md:px-6 text-left">ID</th>
                    <th className="py-3 px-4 md:px-6 text-left">Username</th>
                    <th className="py-3 px-4 md:px-6 text-left">Email</th>
                    <th className="py-3 px-4 md:px-6 text-left">Role(s)</th>
                    <th className="py-3 px-4 md:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-4 md:px-6 text-left whitespace-nowrap">{user.id}</td>
                        <td className="py-3 px-4 md:px-6 text-left">{user.username}</td>
                        <td className="py-3 px-4 md:px-6 text-left">{user.email || <span className="text-gray-400 italic">N/A</span>}</td>
                        <td className="py-3 px-4 md:px-6 text-left">
                          {user.groups && user.groups.length > 0
                            ? user.groups.join(', ')
                            : <span className="text-gray-400 italic">N/A</span>}
                        </td>
                        <td className="py-3 px-4 md:px-6 text-center">
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-150 ease-in-out"
                            aria-label={`Delete user ${user.username}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}a
                </tbody>
              </table>
            </div>
          )}
           {/* Render a message if loading finished but users array is empty and there was no error */}
           {!isLoading && !error && users.length === 0 && (
              <div className="text-center text-gray-500 py-4">No users to display.</div>
           )}
        </div>
      );
  }

  export default UserManagement;