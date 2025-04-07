import React from "react";

type BalanceDisplayProps = {
  balance: number | null | undefined;
};

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  const isNumber = typeof balance === "number" && !isNaN(balance);

  return (
    <div>
      <h3>Your Balance</h3>
      {isNumber ? <p>${balance.toFixed(2)}</p> : <p>Loading balance...</p>}
    </div>
  );
};

export default BalanceDisplay;
