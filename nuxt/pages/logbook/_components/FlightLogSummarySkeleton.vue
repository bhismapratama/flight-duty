<template>
  <div class="flight-log-summary-skeleton" aria-hidden="true">
    <BaseSkeleton width="110px" height="10px" radius="4px" />
    <BaseSkeleton width="132px" height="32px" radius="8px" />
    <div class="stats">
      <div v-for="index in 3" :key="index" class="stat">
        <BaseSkeleton width="56%" height="10px" radius="4px" />
        <BaseSkeleton width="64%" height="14px" radius="4px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flight-log-summary-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: $space-2;
    border-top: 1px solid $color-border;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: $space-3 $space-3 0;

    &:first-child {
      padding-left: 0;
    }

    & + .stat {
      border-left: 1px solid $color-border;
    }
  }
}
</style>
