import { useState } from "react";
import axios from "../../utils/axios";
import Cookies from "js-cookie";
import { useBalance } from './BalanceContext';

type TopUpFormProps = {
  onTopUpSuccess: (newBalance: number) => void;
};

const TopUpForm = ({ onTopUpSuccess }: TopUpFormProps) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const {refreshBalance} = useBalance();

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get("csrftoken");

      const res = await axios.post(
        "http://localhost:8000/users/balance/top-up/",
        {
          amount: parseFloat(amount),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      const rawBalance = res.data.new_balance;
      const newBalance = Number(rawBalance);

      if (isNaN(newBalance)) {
        throw new Error("Invalid balance received from server");
      }

      onTopUpSuccess(newBalance);
      setMessage(`Success! New balance: $${newBalance.toFixed(2)}`);
      setAmount("");
    } catch (err: any) {
      console.error("Top-up error:", err);
      setMessage("Top-up failed. Please try again.");
    }
    refreshBalance();
  };

  return (
    <form onSubmit={handleTopUp}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.5rem",
          maxWidth: "250px",
          width: "100%",
        }}
      >
        <h3>Add Funds</h3>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          style={{
            padding: "0.3rem",
            borderRadius: "4px",
            width: "100%",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.4rem 1rem",
            fontSize: "1rem",
            borderRadius: "6px",
            width: "fit-content",
          }}
        >
          Add
        </button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default TopUpForm;
