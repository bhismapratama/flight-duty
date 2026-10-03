<template>
  <main class="auth-shell">
    <slot />
  </main>
</template>

<style scoped lang="scss">
.auth-shell {
  min-height: 100dvh;
  background: $color-surface;

  @media (min-width: 768px) {
    display: grid;
    place-items: center;
    padding: 48px $space-6;
    background: $color-bg;
  }
}
</style>
