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
  gap: $space-3;
  min-height: 100dvh;
  max-width: $app-max-width;
  margin: 0 auto;
  padding: $space-6;
  text-align: center;

  .logo {
    width: 140px;
    height: auto;
    margin-bottom: $space-6;
  }

  .code {
    font-size: 3rem;
    color: $color-red;
    @include numeric;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 800;
  }

  .message {
    margin-bottom: $space-4;
    color: $color-text-secondary;
  }
}
</style>
