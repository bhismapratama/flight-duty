<script setup lang="ts">
import { CalendarOff, Check } from '@lucide/vue';
import { useDutyDay } from '../_composables/useDutyDay';

const props = defineProps<{ date: string }>();

const { entry, legend, day, ready, errorMessage, refresh } = useDutyDay(toRef(props, 'date'));

const swatchStyle = computed(() =>
  entry.value
    ? { backgroundColor: entry.value.base_color, color: readableTextOn(entry.value.base_color) }
    : undefined,
);

const hoursNote = computed(() => {
  if (!day.value) {
    return null;
  }
  if (day.value.hours === 0) {
    return day.value.isFuture ? 'None planned' : 'No flying';
  }
  return day.value.isFuture ? 'Planned' : 'Flown';
});

const logbookLabel = computed(() => {
  if (!entry.value) {
    return null;
  }
  if (entry.value.is_complete) {
    return 'All logged';
  }
  return `${pluralize(entry.value.remaining, 'duty', 'duties')} left`;
});
</script>

<template>
  <BaseCard class="duty-summary">
    <ErrorState v-if="errorMessage" compact :message="errorMessage" @retry="refresh" />

    <template v-else-if="ready && day">
      <div class="head">
        <span v-if="entry" class="swatch" :style="swatchStyle">{{ entry.duty_type }}</span>
        <span v-else class="swatch is-empty" aria-hidden="true">
          <CalendarOff :size="20" />
        </span>
        <div class="titles">
          <p class="title">
            {{ entry ? (legend?.label ?? entry.duty_type) : 'No duty scheduled' }}
          </p>
          <p class="subtitle">
            {{ entry ? `Base ${entry.base_name}` : 'Nothing is rostered for this day.' }}
          </p>
        </div>
      </div>

      <dl class="stats">
        <div class="stat">
          <dt>Flight hours</dt>
          <dd>
            <span class="value">{{ formatHours(day.hours) }} h</span>
            <span class="note">{{ hoursNote }}</span>
          </dd>
        </div>
        <div v-if="entry" class="stat">
          <dt>Logbook</dt>
          <dd>
            <span class="value" :class="{ 'is-done': entry.is_complete }">
              <Check v-if="entry.is_complete" :size="16" :stroke-width="3" aria-hidden="true" />
              {{ logbookLabel }}
            </span>
            <span class="note">
              {{ entry.count_logbooks }} of {{ entry.count_schedules }} logged
            </span>
          </dd>
        </div>
      </dl>
    </template>

    <div v-else class="loading" aria-busy="true">
      <div class="head" aria-hidden="true">
        <BaseSkeleton width="48px" height="48px" radius="12px" />
        <div class="skeleton-titles">
          <BaseSkeleton width="120px" height="16px" radius="6px" />
          <BaseSkeleton width="80px" height="11px" radius="4px" />
        </div>
      </div>
      <div class="stats" aria-hidden="true">
        <div v-for="index in 2" :key="index" class="stat">
          <BaseSkeleton width="60%" height="10px" radius="4px" />
          <BaseSkeleton width="50%" height="16px" radius="4px" />
          <BaseSkeleton width="40%" height="10px" radius="4px" />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
@use 'sass:color';

.duty-summary {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .head {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  .swatch {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.04em;

    &.is-empty {
      background: $color-muted;
      color: $color-text-secondary;
    }
  }

  .titles {
    min-width: 0;
  }

  .title {
    font-size: 1.0625rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .subtitle {
    font-size: 0.8125rem;
    color: $color-text-secondary;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
    border-top: 1px solid $color-border;
  }

  .stat {
    padding: $space-3 $space-3 0;

    &:first-child {
      padding-left: 0;
    }

    & + .stat {
      border-left: 1px solid $color-border;
    }

    dt {
      @include eyebrow;
    }

    dd {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin: $space-1 0 0;
    }
  }

  .value {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-size: 1.0625rem;
    @include numeric;

    &.is-done {
      color: color.adjust($color-success, $lightness: -12%);
    }
  }

  .note {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }

  .loading {
    display: flex;
    flex-direction: column;
    gap: $space-4;

    .stat {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }

  .skeleton-titles {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }
}
</style>
