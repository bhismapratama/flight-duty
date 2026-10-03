<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const isNotFound = computed(() => props.error.statusCode === 404);

useHead({ title: isNotFound.value ? 'Page not found' : 'Error' });

const goHome = () => clearError({ redirect: '/home' });
</script>

<template>
  <main class="error-page">
    <img src="/images/logo.png" alt="Susi Air" class="logo" width="160" height="40" />
    <p class="code">{{ error.statusCode }}</p>
    <h1 class="title">{{ isNotFound ? 'Page not found' : 'Something went wrong' }}</h1>
    <p class="message">
      {{
        isNotFound
          ? 'The page you are looking for does not exist.'
          : error.statusMessage || error.message
      }}
    </p>
    <BaseButton @click="goHome">Back to Home</BaseButton>
  </main>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding: $space-6;
  text-align: center;

  .logo {
    width: 120px;
    height: auto;
    margin-bottom: $space-8;
  }

  .code {
    font-size: 3.5rem;
    line-height: 1;
    color: $color-red;
    @include numeric;
  }

  .title {
    margin-top: $space-2;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .message {
    margin-bottom: $space-5;
    color: $color-text-secondary;
  }
}
</style>
