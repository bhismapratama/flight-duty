<script setup lang="ts">
if (isNativePlatform()) {
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
