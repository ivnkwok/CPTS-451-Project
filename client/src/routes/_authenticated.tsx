import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
// Option 1: Import your login route if available from your generated routes.
// import { LoginRoute } from './login'; 

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    // Check if a token exists in your auth context.
    if (/*!context.auth.token*/context) {
      // Option 1: If you have a LoginRoute exported from your routes,
      // throw redirect({ to: LoginRoute.id, search: { redirect: location.href } });
      // Option 2: If you rely on a hardcoded string, ensure your generated route types include it.
      throw redirect({
        to: '/login', // Ensure your login route is correctly defined and picked up by the file-based system.
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
