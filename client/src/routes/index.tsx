import { createFileRoute } from "@tanstack/react-router";
import Menu from "../pages/menu/Menu";
import BalanceDisplay from "../components/balance/BalanceDisplay";

const MenuPage = () => {
  return (
    <div>
      <BalanceDisplay />
      <Menu />
    </div>
  );
};

// Route definition for the homepage "/"
export const Route = createFileRoute("/")({
  component: MenuPage,
});
