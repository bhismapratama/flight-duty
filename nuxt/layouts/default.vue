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
    padding-bottom: calc(
      #{$bottom-nav-height} + #{$bottom-nav-offset} + #{$space-8} + #{safe-inset(bottom)}
    );
  }

  @media (min-width: 768px) {
    .content {
      padding-inline: $space-6;
    }
  }
}
</style>
