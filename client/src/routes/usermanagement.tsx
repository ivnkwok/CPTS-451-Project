import { createFileRoute } from "@tanstack/react-router";
import UserManagement from "../components/user/user";

export const Route = createFileRoute('/usermanagement')({
  component: UserManagement,
})