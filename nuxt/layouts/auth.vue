<template>
  <main class="auth-shell">
    <slot />
  </main>
</template>

<style scoped lang="scss">
.auth-shell {
  min-height: 100dvh;
  max-width: $app-max-width;
  margin: 0 auto;
  background: $color-surface;
}
</style>
