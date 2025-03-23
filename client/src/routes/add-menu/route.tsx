import { createFileRoute } from "@tanstack/react-router";
import AddMenuPage from "../../pages/AddMenuPages"; // Direct static import for now

export const Route = createFileRoute("/add-menu")({
  component: AddMenuPage,
});
