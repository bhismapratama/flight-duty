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
    display: grid;
    gap: $space-8;
    padding: $space-6 $space-4 0;
  }

  @media (min-width: 768px) {
    .body {
      padding: $space-8 0 0;
    }
  }

  @media (min-width: 1024px) {
    .body {
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
      align-items: start;
      gap: $space-6;
    }
  }
}
</style>
