import { createFileRoute } from "@tanstack/react-router";
import { DeleteMenuItems } from "../../components/menu/DeleteMenuItem";

export const Route = createFileRoute("/menu/delete-menu")({
  component: DeleteMenuItems,
});