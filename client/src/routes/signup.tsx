import { createFileRoute } from "@tanstack/react-router";
import Signup from "../components/auth/signup/Signup";

export const Route = createFileRoute('/signup')({
  component: Signup,
})