import { createFileRoute } from "@tanstack/react-router";
import Feedback from "../pages/feedback/Feedback";

export const Route = createFileRoute('/feedback')({
  component: Feedback,
})