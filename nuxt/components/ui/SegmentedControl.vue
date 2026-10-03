<script setup lang="ts" generic="T extends string">
const model = defineModel<T>({ required: true });

const props = defineProps<{
  options: { value: T; label: string }[];
  label: string;
}>();

const group = useTemplateRef<HTMLElement>('group');

const KEY_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

function select(index: number): void {
  const option = props.options[index];
  if (!option) {
    return;
  }
  model.value = option.value;
  group.value?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[index]?.focus();
}

function onKeydown(event: KeyboardEvent): void {
  const count = props.options.length;
  const current = props.options.findIndex(option => option.value === model.value);
  let target: number | undefined;
  if (event.key in KEY_STEPS) {
    target = (current + KEY_STEPS[event.key]! + count) % count;
  } else if (event.key === 'Home') {
    target = 0;
  } else if (event.key === 'End') {
    target = count - 1;
  }
  if (target === undefined) {
    return;
  }
  event.preventDefault();
  select(target);
}
</script>

<template>
  <div
    ref="group"
    class="segmented-control"
    role="radiogroup"
    :aria-label="label"
    @keydown="onKeydown"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="option"
      :class="{ 'is-active': option.value === model }"
      :aria-checked="option.value === model"
      :tabindex="option.value === model ? 0 : -1"
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
    min-height: 38px;
    padding: 0 $space-2;
    border-radius: $radius-pill;
    font-size: 0.8125rem;
    font-weight: 700;
    color: $color-text-secondary;
    transition:
      background-color $transition-fast,
      color $transition-fast;

    &:hover:not(&.is-active) {
      color: $color-navy;
    }

    &.is-active {
      background: $color-navy;
      color: $color-surface;
    }
  }
}
</style>
