<script setup lang="ts" generic="T extends string">
const model = defineModel<T>({ required: true });

defineProps<{
  options: { value: T; label: string }[];
  label: string;
}>();
</script>

<template>
  <div class="segmented-control" role="radiogroup" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="option"
      :class="{ 'is-active': option.value === model }"
      :aria-checked="option.value === model"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.segmented-control {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: 2px;
  padding: 3px;
  border-radius: $radius-pill;
  background: $color-muted;

  .option {
    min-height: 34px;
    padding: 0 $space-2;
    border-radius: $radius-pill;
    font-size: 0.8rem;
    font-weight: 700;
    color: $color-text-secondary;
    transition:
      background-color $transition-fast,
      color $transition-fast;

    &.is-active {
      background: $color-navy;
      color: $color-surface;
    }
  }
}
</style>
