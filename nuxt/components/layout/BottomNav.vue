<script setup lang="ts">
import { BOTTOM_NAVIGATION } from '~/constants/navigation';

const route = useRoute();

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`);
</script>

<template>
  <nav class="bottom-nav" aria-label="Main">
    <ul class="list">
      <li v-for="item in BOTTOM_NAVIGATION" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="link"
          :class="{ 'is-active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <component
            :is="item.icon"
            :size="22"
            :stroke-width="isActive(item.to) ? 2.4 : 1.8"
            aria-hidden="true"
          />
          <span class="label">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  inset: auto 0 0;
  z-index: 20;
  background: $color-surface;
  box-shadow: $shadow-nav;
  @include safe-area-bottom;

  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-width: $app-max-width;
    height: $bottom-nav-height;
    margin: 0 auto;
  }

  .link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 100%;
    color: $color-text-secondary;
    font-size: 0.7rem;
    font-weight: 600;
    transition: color $transition-fast;

    &.is-active {
      color: $color-red;
    }
  }
}
</style>
