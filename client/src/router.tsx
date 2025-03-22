import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as menuRoute } from './routes/menu';
import { Route as aboutRoute } from './routes/about';
import { Route as loginRoute } from './routes/login';
import { Route as indexRoute } from './routes/index';

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  aboutRoute,
  loginRoute,
]);

export const router = createRouter({ routeTree }); 