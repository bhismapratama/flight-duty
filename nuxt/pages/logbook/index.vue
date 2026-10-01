<script setup lang="ts">
import { BookOpenText } from '@lucide/vue';

useHead({ title: 'Logbook · Susi Air Pilot' });
</script>

<template>
  <div class="logbook-page">
    <PageHeader title="Logbook" />
    <div class="body">
      <ComingSoon
        :icon="BookOpenText"
        title="Logbook coming soon"
        description="Logging flights from the app is not part of this release."
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.logbook-page .body {
  padding: 0 $space-4;
}
</style>
