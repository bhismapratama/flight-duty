<script setup lang="ts">
import { Plane } from '@lucide/vue';

const pilot = usePilotStore();

onMounted(() => {
  pilot.fetchProfile();
});

const firstName = computed(() => pilot.profile?.name.split(' ')[0] ?? '');
</script>

<template>
  <header class="home-header">
    <div class="top">
      <img src="/images/logo-white.png" alt="Susi Air" class="logo" width="120" height="40" />
      <BaseAvatar
        v-if="pilot.profile"
        :src="pilot.profile.avatarUrl"
        :name="pilot.profile.name"
        :size="44"
      />
      <BaseSkeleton v-else width="44px" height="44px" radius="50%" />
    </div>

    <div v-if="pilot.profile" class="identity">
      <p class="greeting">Welcome back, Captain {{ firstName }}</p>
      <h1 class="name">{{ pilot.profile.name }}</h1>
      <p class="hours">
        <Plane :size="16" aria-hidden="true" />
        <span class="hours-value">{{ formatHours(pilot.profile.totalFlightHours) }}</span>
        <span>total flight hours</span>
      </p>
    </div>

    <div v-else-if="pilot.status === 'error'" class="identity">
      <p class="greeting">Welcome back</p>
      <p class="error">
        {{ pilot.errorMessage }}
        <button type="button" class="retry" @click="pilot.fetchProfile(true)">Retry</button>
      </p>
    </div>

    <div v-else class="identity" aria-busy="true">
      <BaseSkeleton width="160px" height="14px" />
      <BaseSkeleton width="200px" height="26px" />
      <BaseSkeleton width="180px" height="28px" radius="999px" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.home-header {
  padding: $space-4 $space-5 $space-8;
  background: $color-navy;
  color: $color-surface;
  border-radius: 0 0 24px 24px;
  @include safe-area-top($space-4);

  :deep(.base-skeleton) {
    opacity: 0.15;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    width: 96px;
    height: auto;
  }

  .identity {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    margin-top: $space-6;
  }

  .greeting {
    font-size: 0.875rem;
    color: rgba($color-surface, 0.72);
  }

  .name {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .hours {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: $space-2;
    margin-top: $space-1;
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: rgba($color-surface, 0.1);
    font-size: 0.8rem;
    color: rgba($color-surface, 0.85);
  }

  .hours-value {
    font-size: 0.95rem;
    color: $color-surface;
    @include numeric;
  }

  .error {
    font-size: 0.875rem;
    color: rgba($color-surface, 0.85);
  }

  .retry {
    margin-left: $space-2;
    font-weight: 700;
    text-decoration: underline;
    color: $color-surface;
  }
}
</style>
