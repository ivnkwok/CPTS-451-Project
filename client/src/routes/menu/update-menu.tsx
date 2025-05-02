import { createFileRoute } from "@tanstack/react-router";
import UpdateMenuItem from "../../components/menu/UpdateMenuItem";

export const Route = createFileRoute("/menu/update-menu")({
  component: UpdateMenuItem,
});