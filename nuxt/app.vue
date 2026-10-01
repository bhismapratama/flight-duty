<script setup lang="ts">
if (isNativePlatform()) {
  useAndroidBackButton();
  useStatusBar();
}
</script>

<template>
  <NuxtLoadingIndicator color="#E63757" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
