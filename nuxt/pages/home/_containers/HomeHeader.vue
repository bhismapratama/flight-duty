<script setup lang="ts">
import { Plane } from '@lucide/vue';
import { HEADER_SLIDE_INTERVAL, HEADER_SLIDES } from '~/constants/header-slides';

const pilot = usePilotStore();

onMounted(() => {
  pilot.fetchProfile();
});

const firstName = computed(() => pilot.profile?.name.split(' ')[0] ?? '');

const { active, isReady } = useAutoSlides(
  HEADER_SLIDES.map(slide => slide.src),
  HEADER_SLIDE_INTERVAL,
);

const slideStyle = (index: number) => {
  const slide = HEADER_SLIDES[index]!;
  return isReady(index)
    ? {
        backgroundImage: `url(${slide.src})`,
        '--slide-position': slide.position,
        '--slide-position-desktop': slide.desktopPosition,
      }
    : undefined;
};
</script>

<template>
  <header class="home-header">
    <div class="slides" aria-hidden="true">
      <span
        v-for="(slide, index) in HEADER_SLIDES"
        :key="slide.src"
        class="slide"
        :class="{ 'is-active': index === active }"
        :style="slideStyle(index)"
      />
    </div>
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
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: $space-4 $space-5 $space-6;
  border-radius: 0 0 $radius-xl $radius-xl;
  background: $color-navy;
  color: $color-surface;
  @include safe-area-top($space-4);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      180deg,
      rgba($color-navy, 0.45) 0%,
      rgba($color-navy, 0.15) 30%,
      rgba($color-navy, 0.85) 62%,
      rgba($color-navy, 0.97) 100%
    );
  }

  .slides {
    position: absolute;
    inset: 0;
    z-index: -2;
  }

  .slide {
    position: absolute;
    inset: 0;
    background-position: var(--slide-position, center);
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0;
    transform: scale(1.05);
    transition:
      opacity 0.8s ease,
      transform 5s ease-out;

    &.is-active {
      opacity: 1;
      transform: scale(1);
    }
  }

  :deep(.base-skeleton) {
    opacity: 0.18;
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
    gap: $space-1;
    margin-top: 72px;
  }

  .greeting {
    font-size: 0.875rem;
    color: rgba($color-surface, 0.8);
  }

  .name {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  .hours {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: $space-2;
    margin-top: $space-3;
    font-size: 0.8125rem;
    color: rgba($color-surface, 0.8);

    svg {
      box-sizing: content-box;
      flex-shrink: 0;
      padding: 7px;
      border-radius: 50%;
      background: $color-red;
      color: $color-surface;
    }
  }

  .hours-value {
    font-size: 1.125rem;
    color: $color-surface;
    @include numeric;
  }

  .error {
    margin-top: $space-1;
    font-size: 0.875rem;
    color: rgba($color-surface, 0.9);
  }

  .retry {
    min-height: $tap-target;
    margin-left: $space-2;
    font-weight: 700;
    text-decoration: underline;
    color: $color-surface;
  }

  @media (min-width: 768px) {
    margin-top: $space-6;
    padding: $space-6 $space-8 $space-8;
    border-radius: $radius-xl;

    &::before {
      background: linear-gradient(
        90deg,
        rgba($color-navy, 0.95) 0%,
        rgba($color-navy, 0.7) 40%,
        rgba($color-navy, 0.05) 75%
      );
    }

    .slide {
      background-position: var(--slide-position-desktop, center);
    }

    .identity {
      margin-top: 88px;
    }

    .name {
      font-size: 2.25rem;
    }
  }
}
</style>
