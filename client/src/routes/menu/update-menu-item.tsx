import { createFileRoute } from "@tanstack/react-router";
import UpdateMenuItem from "../../pages/menu/UpdateMenuItem";

export const Route = createFileRoute("/menu/update-menu-item")({
  component: UpdateMenuItem,
});