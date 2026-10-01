<script setup lang="ts">
const model = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    id: string;
    label: string;
    type?: 'text' | 'password';
    autocomplete?: string;
    placeholder?: string;
    error?: string | null;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    autocomplete: 'off',
    placeholder: '',
    error: null,
    disabled: false,
  },
);
</script>

<template>
  <div class="base-input" :class="{ 'is-invalid': error }">
    <label :for="id" class="label">{{ label }}</label>
    <div class="control">
      <input
        :id="id"
        v-model="model"
        :type="type"
        :name="id"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="field"
        autocapitalize="off"
        spellcheck="false"
      />
      <div v-if="$slots.trailing" class="trailing">
        <slot name="trailing" />
      </div>
    </div>
    <p v-if="error" :id="`${id}-error`" class="error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $color-text;
  }

  .control {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field {
    width: 100%;
    min-height: 50px;
    padding: 0 $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background: $color-surface;
    font-size: 1rem;
    transition:
      border-color $transition-fast,
      box-shadow $transition-fast;

    &::placeholder {
      color: $color-text-secondary;
    }

    &:focus {
      outline: none;
      border-color: $color-navy;
      box-shadow: 0 0 0 3px rgba($color-navy, 0.08);
    }
  }

  .trailing {
    position: absolute;
    right: $space-1;
    display: flex;
  }

  &:has(.trailing) .field {
    padding-right: 52px;
  }

  .error {
    font-size: 0.8rem;
    color: $color-danger;
  }

  &.is-invalid .field {
    border-color: $color-danger;
  }
}
</style>
