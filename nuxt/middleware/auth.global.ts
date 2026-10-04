import { ROUTES } from '~/constants/routes';

export default defineNuxtRouteMiddleware(async to => {
  const auth = useAuthStore();
  await auth.restore();

  if (!auth.isAuthenticated && to.meta.public !== true) {
    return navigateTo(ROUTES.login, { replace: true });
  }

  if (auth.isAuthenticated && to.path === ROUTES.login) {
    return navigateTo(ROUTES.home, { replace: true });
  }
});
