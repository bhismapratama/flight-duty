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
@use 'sass:color';

$active-shade: color.adjust($color-red, $lightness: -24%);

.bottom-nav {
  position: fixed;
  inset: auto $bottom-nav-offset calc(#{$bottom-nav-offset} + #{safe-inset(bottom)});
  z-index: 20;
  max-width: 440px;
  margin-inline: auto;
  border: 1px solid $color-border;
  border-radius: 20px;
  background: rgba($color-surface, 0.92);
  box-shadow: $shadow-float;
  backdrop-filter: blur(16px) saturate(1.4);

  .list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    height: $bottom-nav-height;
    padding: 0 $space-1;
  }

  .link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 100%;
    color: $color-text-secondary;
    font-size: 0.6875rem;
    font-weight: 600;
    transition: color $transition-fast;

    svg {
      width: 22px;
      height: 22px;
      overflow: visible;
    }

    &.is-active {
      color: $color-red-hover;
      font-weight: 800;

      svg {
        fill: $color-red;
        stroke: $color-surface;
        filter: drop-shadow(2px 2px 0 $active-shade);
        animation: bottom-nav-pop 280ms ease-out;
      }
    }

    @media (hover: hover) {
      &:hover:not(&.is-active) {
        color: $color-navy;
      }
    }
  }
}

@keyframes bottom-nav-pop {
  0% {
    transform: scale(0.85);
  }

  60% {
    transform: scale(1.12);
  }

  100% {
    transform: scale(1);
  }
}
</style>
