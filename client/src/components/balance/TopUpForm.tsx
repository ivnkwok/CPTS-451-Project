import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const TopUpForm = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get("csrftoken"); // 🛡️ Get CSRF token from cookie

      const res = await axios.post(
        "http://localhost:8000/users/balance/top-up/",
        {
          amount: parseFloat(amount),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "", // 🛡️ Send token in header
          },
        }
      );

      setMessage(`Success! New balance: $${res.data.new_balance}`);
      setAmount(""); // Clear input
    } catch (err: any) {
      console.error("Top-up error:", err);
      setMessage("Top-up failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleTopUp}>
      <h3>Top Up Your Balance</h3>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <button type="submit">Top Up</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default TopUpForm;
