<script setup lang="ts">
import { Construction } from '@lucide/vue';
import type { Component } from 'vue';

withDefaults(defineProps<{ title?: string; description?: string; icon?: Component }>(), {
  title: 'Coming soon',
  description: 'This feature is not available yet.',
  icon: () => Construction,
});
</script>

<template>
  <BaseCard class="coming-soon">
    <EmptyState :icon="icon" :title="title" :description="description">
      <slot />
    </EmptyState>
  </BaseCard>
</template>

<style scoped lang="scss">
.coming-soon {
  padding: $space-8 $space-4;
}
</style>
