import axios from "axios";

export async function getCSRFToken(): Promise<string> {
  try {
    await axios.get("http://localhost:8000/users/csrf/", {
      withCredentials: true,
    });
    const match = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
    return match ? match[2] : "";
  } catch (err) {
    console.error("Failed to get CSRF token:", err);
    return "";
  }
}
