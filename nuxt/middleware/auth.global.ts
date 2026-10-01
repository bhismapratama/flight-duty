export default defineNuxtRouteMiddleware(async to => {
  const auth = useAuthStore();
  await auth.restore();

  if (!auth.isAuthenticated && to.meta.public !== true) {
    return navigateTo('/login', { replace: true });
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/home', { replace: true });
  }
});
