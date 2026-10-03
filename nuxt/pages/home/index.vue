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
$home-overlap: 84px;

.home-page {
  .body {
    display: grid;
    gap: $space-8;
    padding: $space-6 $space-4 0;
  }

  @media (max-width: 767px) {
    :deep(.home-header) {
      padding-bottom: calc(#{$space-6} + #{$home-overlap});
    }

    .body {
      position: relative;
      margin-top: -$home-overlap;
      padding-top: 0;
    }

    :deep(.hours-to-limit > .header > .title) {
      color: $color-surface;
    }

    :deep(.hours-to-limit > .header > .meta) {
      color: rgba($color-surface, 0.72);
    }

    :deep(.hours-to-limit > .cards) {
      filter: drop-shadow(0 8px 20px rgba($color-navy, 0.1));
    }

    :deep(.hours-to-limit > .error-state) {
      @include card;
    }
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
