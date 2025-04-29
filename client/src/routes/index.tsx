import { createFileRoute } from "@tanstack/react-router";
import Menu from "../pages/menu/Menu";
import { BalanceProvider } from "../components/balance/BalanceContext";

const MenuPage = () => {
  return (
    <div>
      <BalanceProvider>
        <Menu />
      </BalanceProvider>
    </div>
  );
};

// Route definition for the homepage "/"
export const Route = createFileRoute("/")({
  component: MenuPage,
});
