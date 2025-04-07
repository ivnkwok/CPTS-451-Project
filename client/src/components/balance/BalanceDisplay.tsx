import React, { useEffect, useState } from "react";
import { fetchBalance } from "../../utils/fetchBalance";

const BalanceDisplay = () => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      const amt = await fetchBalance();
      setBalance(amt);
    };
    loadBalance();
  }, []);

  return (
    <div>
      <h2>Your Balance</h2>
      {balance !== null ? <p>${balance}</p> : <p>Loading balance...</p>}
    </div>
  );
};

export default BalanceDisplay;
