import { createFileRoute } from "@tanstack/react-router";
import Login from "../components/auth/Login";

export const Route = createFileRoute('/login')({
  component: Login,
})