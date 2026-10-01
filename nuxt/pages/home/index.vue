<script setup lang="ts">
import HomeHeader from './_containers/HomeHeader.vue';
import HoursToLimit from './_containers/HoursToLimit.vue';
import MyDocuments from './_containers/MyDocuments.vue';

useHead({ title: 'Home · Susi Air Pilot' });
</script>

<template>
  <div class="home-page">
    <HomeHeader />
    <div class="body">
      <HoursToLimit />
      <MyDocuments />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  .body {
    display: flex;
    flex-direction: column;
    gap: $space-6;
    padding: $space-5 $space-4 0;
  }
}
</style>
