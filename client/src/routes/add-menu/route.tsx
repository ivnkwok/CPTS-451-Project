import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add-menu")({
  component: () =>
    import("../../pages/AddMenuPages").then((m) => <m.default />),
});
