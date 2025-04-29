import { createFileRoute } from '@tanstack/react-router'
import Faq from '../pages/faq/faq'

export const Route = createFileRoute('/faq')({
  component: Faq,
})