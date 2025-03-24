import { createFileRoute } from "@tanstack/react-router";
import AddMenuPage from "../../pages/menu/AddMenu"; // Direct static import for now

export const Route = createFileRoute("/menu/add-menu")({
  component: AddMenuPage,
});