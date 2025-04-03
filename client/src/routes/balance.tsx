import { createFileRoute } from "@tanstack/react-router";
import BalanceCheck from "../components/balance/BalanceCheck";

export const Route = createFileRoute('/balance')({
  component: BalanceCheck,
}); 