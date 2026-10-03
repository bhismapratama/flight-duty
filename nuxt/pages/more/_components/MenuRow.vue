<script setup lang="ts">
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { ChevronRight, LoaderCircle } from '@lucide/vue';

const props = defineProps<{
  icon: Component;
  label: string;
  to?: RouteLocationRaw;
  danger?: boolean;
  loading?: boolean;
}>();

defineEmits<{ click: [] }>();

const NuxtLink = resolveComponent('NuxtLink');
const tag = computed(() => (props.to ? NuxtLink : 'button'));
</script>

<template>
  <li class="menu-row" :class="{ 'is-danger': danger }">
    <component
      :is="tag"
      :to="to"
      :type="to ? undefined : 'button'"
      :disabled="loading || undefined"
      :aria-busy="loading || undefined"
      class="action"
      @click="$emit('click')"
    >
      <span class="icon">
        <LoaderCircle v-if="loading" :size="18" class="spinner" aria-hidden="true" />
        <component :is="icon" v-else :size="18" aria-hidden="true" />
      </span>
      <span class="label">{{ label }}</span>
      <ChevronRight v-if="!danger" :size="18" class="chevron" aria-hidden="true" />
    </component>
  </li>
</template>

<style scoped lang="scss">
.menu-row {
  & + & {
    border-top: 1px solid $color-border;
  }

  .action {
    display: flex;
    align-items: center;
    gap: $space-3;
    width: 100%;
    min-height: 56px;
    padding: $space-2 0;
    color: $color-text;
    text-align: left;
    @include tap-reset;

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      cursor: progress;
    }
  }

  .icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: $radius-md;
    background: $color-muted;
    color: $color-navy;
  }

  .label {
    flex: 1;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  .chevron {
    flex-shrink: 0;
    color: $color-text-secondary;
    transition: transform 150ms ease;
  }

  .action:hover .chevron {
    transform: translateX(2px);
  }

  .spinner {
    animation: menu-row-spin 0.8s linear infinite;
  }

  &.is-danger .action {
    color: $color-red-hover;
  }

  &.is-danger .icon {
    background: rgba($color-red, 0.08);
    color: $color-red-hover;
  }
}

@keyframes menu-row-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
