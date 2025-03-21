import { createFileRoute } from "@tanstack/react-router";
import Login from "../components/firebase/login/Login";

export const Route = createFileRoute('/login')({
  component: Login,
})