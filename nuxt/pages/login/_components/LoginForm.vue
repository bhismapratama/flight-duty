<script setup lang="ts">
import { CircleAlert, Eye, EyeOff } from '@lucide/vue';
import { useLogin } from '../_composables/useLogin';

const { form, fieldErrors, submitError, pending, submit } = useLogin();
const showPassword = ref(false);
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="submit">
    <div v-if="submitError" class="alert" role="alert">
      <CircleAlert :size="18" aria-hidden="true" />
      <span>{{ submitError }}</span>
    </div>

    <BaseInput
      id="username"
      v-model="form.username"
      label="Username"
      autocomplete="username"
      placeholder="Enter your username"
      :error="fieldErrors.username"
      :disabled="pending"
    />

    <BaseInput
      id="password"
      v-model="form.password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password"
      placeholder="Enter your password"
      :error="fieldErrors.password"
      :disabled="pending"
    >
      <template #trailing>
        <button
          type="button"
          class="toggle"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          <EyeOff v-if="showPassword" :size="20" aria-hidden="true" />
          <Eye v-else :size="20" aria-hidden="true" />
        </button>
      </template>
    </BaseInput>

    <BaseButton type="submit" block :loading="pending">
      {{ pending ? 'Signing in…' : 'Sign In' }}
    </BaseButton>
  </form>
</template>

<style scoped lang="scss">
.login-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .alert {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    padding: $space-3;
    border-radius: $radius-md;
    background: rgba($color-danger, 0.07);
    color: $color-red-hover;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;

    svg {
      flex-shrink: 0;
      margin-top: 1px;
    }
  }

  .toggle {
    display: grid;
    place-items: center;
    width: $tap-target;
    height: $tap-target;
    border-radius: $radius-sm;
    color: $color-text-secondary;
  }

  :deep(.base-button) {
    margin-top: $space-2;
  }
}
</style>
