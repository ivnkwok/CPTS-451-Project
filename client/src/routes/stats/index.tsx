import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "../../utils/axios";

type Balance = {
  user__username: string;
  amount: string;
};

type Item = {
  name: string;
  times_bought: number;
};

export const Route = createFileRoute("/stats/")({
  component: StatsPage,
});

function StatsPage() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios
      .get("/menu/stats/")
      .then((res) => {
        setBalances(res.data.balances);
        setItems(res.data.items);
      })
      .catch((err) => console.error("Failed to load stats", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dining Hall Statistics</h1>

      <section>
        <h2>Student Balances</h2>
        <ul>
          {balances.map((b, i) => (
            <li key={i}>
              {b.user__username}: ${Number(b.amount).toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Menu Item Purchases</h2>
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.name}: {item.times_bought} sold
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
