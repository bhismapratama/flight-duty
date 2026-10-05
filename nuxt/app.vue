<script setup lang="ts">
if (isNativePlatform()) {
  useHead({ htmlAttrs: { class: 'is-native' } });
  useAndroidBackButton();
  useStatusBar();
  useSplashScreen();
}
</script>

<template>
  <NuxtLoadingIndicator color="var(--color-red)" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
