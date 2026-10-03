<template>
  <BaseCard class="calendar-skeleton" aria-hidden="true">
    <div class="header">
      <BaseSkeleton width="40px" height="40px" radius="50%" />
      <BaseSkeleton width="120px" height="16px" radius="6px" />
      <BaseSkeleton width="40px" height="40px" radius="50%" />
    </div>
    <div class="grid">
      <BaseSkeleton
        v-for="index in 7"
        :key="`weekday-${index}`"
        height="10px"
        radius="4px"
        class="weekday"
      />
      <BaseSkeleton
        v-for="index in 35"
        :key="index"
        height="auto"
        radius="10px"
        class="tile"
        :style="{ animationDelay: `${((index - 1) % 7) * 90}ms` }"
      />
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
.calendar-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-3;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 5px;
  }

  .weekday {
    justify-self: center;
    width: 60%;
    margin-bottom: $space-2;
  }

  .tile {
    min-height: 52px;
    animation: calendar-skeleton-pulse 1.4s ease-in-out infinite;
  }

  @media (min-width: 400px) {
    padding: $space-4;

    .grid {
      gap: 6px;
    }

    .tile {
      min-height: 58px;
    }
  }

  @media (min-width: 768px) {
    padding: $space-6;

    .grid {
      gap: $space-2;
    }

    .tile {
      min-height: 76px;
    }
  }
}

@keyframes calendar-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
