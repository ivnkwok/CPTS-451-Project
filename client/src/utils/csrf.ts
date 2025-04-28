import axios from "axios";

export const getCSRFToken = async () => {
  try {
    await axios.get("http://localhost:8000/users/csrf/", {
      withCredentials: true,
    });
    console.log("CSRF token set via cookie.");
  } catch (err) {
    console.error("Failed to get CSRF token:", err);
  }
};

