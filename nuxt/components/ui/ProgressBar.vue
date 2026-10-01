<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number;
    label: string;
    tone?: 'success' | 'warning' | 'danger';
  }>(),
  { tone: 'success' },
);

const width = computed(() => `${Math.min(Math.max(props.value, 0), 100)}%`);
</script>

<template>
  <div
    class="progress-bar"
    :class="`is-${tone}`"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="Math.round(value)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <span class="fill" :style="{ width }" />
  </div>
</template>

<style scoped lang="scss">
$tones: (
  success: $color-success,
  warning: $color-warning,
  danger: $color-danger,
);

.progress-bar {
  height: 6px;
  border-radius: $radius-pill;
  background: $color-muted;
  overflow: hidden;

  .fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    transition: width 400ms ease;
  }

  @each $name, $color in $tones {
    &.is-#{$name} .fill {
      background: $color;
    }
  }
}
</style>
