import axios from "axios";

export const fetchBalance = async () => {
  try {
    const res = await axios.get("http://localhost:8000/users/balance/", {
      withCredentials: true,
    });
    console.log("Balance:", res.data.amount);
    return res.data.amount;
  } catch (err) {
    console.error("Error fetching balance:", err);
    return null;
  }
};
