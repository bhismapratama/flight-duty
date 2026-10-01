<template>
  <div class="app-shell">
    <main class="content">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100dvh;

  .content {
    max-width: $app-max-width;
    margin: 0 auto;
    padding-bottom: calc(#{$bottom-nav-height} + #{$space-6} + #{safe-inset(bottom)});
  }
}
</style>
