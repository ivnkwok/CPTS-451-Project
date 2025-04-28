import { createFileRoute } from "@tanstack/react-router";
import Menu from "../pages/menu/Menu";
import BalanceDisplay from "../components/balance/BalanceDisplay";
import TopUpForm from "../components/balance/TopUpForm";

const MenuPage = () => {
  return (
    <div>
      <Menu />
    </div>
  );
};

// Route definition for the homepage "/"
export const Route = createFileRoute("/")({
  component: MenuPage,
});
