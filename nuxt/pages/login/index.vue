<script setup lang="ts">
import { LOGIN_SLIDE_INTERVAL, LOGIN_SLIDES } from '~/constants/login-slides';
import LoginForm from './_components/LoginForm.vue';

definePageMeta({ layout: 'auth', public: true });

useHead({ title: 'Sign In · Susi Air Pilot' });

const [firstSlide, ...nextSlides] = LOGIN_SLIDES;

const { active, isReady } = useAutoSlides(
  LOGIN_SLIDES.map(slide => slide.src),
  LOGIN_SLIDE_INTERVAL,
);

const story = computed(() => LOGIN_SLIDES[active.value]!);

const slideStyle = (index: number) => {
  const slide = LOGIN_SLIDES[index]!;
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
  <div class="login-page">
    <section class="hero">
      <img
        :src="firstSlide!.src"
        alt=""
        class="photo"
        width="1200"
        height="667"
        fetchpriority="high"
      />
      <div class="slides" aria-hidden="true">
        <span
          v-for="(slide, index) in nextSlides"
          :key="slide.src"
          class="slide"
          :class="{ 'is-active': index + 1 === active }"
          :style="slideStyle(index + 1)"
        />
      </div>
      <div class="hero-content">
        <img src="/images/logo-white.png" alt="Susi Air" class="logo" width="120" height="40" />
        <p class="eyebrow">Pilot App</p>
      </div>
      <div class="story">
        <Transition name="login-story" mode="out-in">
          <div :key="active" class="caption">
            <p class="caption-title">{{ story.title }}</p>
            <p class="caption-text">{{ story.text }}</p>
          </div>
        </Transition>
        <div class="dots" aria-hidden="true">
          <span
            v-for="(slide, index) in LOGIN_SLIDES"
            :key="slide.src"
            class="dot"
            :class="{ 'is-active': index === active }"
          />
        </div>
      </div>
    </section>

    <section class="panel">
      <header class="header">
        <h1 class="title">Welcome, Captain</h1>
        <p class="subtitle">Sign in to view your schedule, flight hours and duty limits.</p>
      </header>
      <LoginForm />
    </section>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100dvh;
  background: $color-navy;

  .hero {
    position: relative;
    height: clamp(280px, 46dvh, 440px);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba($color-navy, 0.7) 0%,
        rgba($color-navy, 0) 32%,
        rgba($color-navy, 0.1) 50%,
        rgba($color-navy, 0.92) 100%
      );
    }
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 45% 45%;
  }

  .slides {
    position: absolute;
    inset: 0;
  }

  .slide {
    position: absolute;
    inset: 0;
    background-color: $color-navy;
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

  .story {
    position: absolute;
    inset: auto 0 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: $space-3;
    padding: 0 $space-5 calc(#{$space-6} + #{$space-4});
    color: $color-surface;
  }

  .caption {
    max-width: 340px;
  }

  .caption-title {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .caption-text {
    margin-top: $space-1;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: rgba($color-surface, 0.78);
  }

  .dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: $radius-pill;
    background: rgba($color-surface, 0.4);
    transition:
      width 300ms ease,
      background-color 300ms ease;

    &.is-active {
      width: 20px;
      background: $color-surface;
    }
  }

  .hero-content {
    position: absolute;
    inset: 0 0 auto;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-5;
    @include safe-area-top($space-5);
  }

  .logo {
    width: 104px;
    height: auto;
  }

  .eyebrow {
    padding-left: $space-3;
    border-left: 1px solid rgba($color-surface, 0.35);
    color: rgba($color-surface, 0.85);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .panel {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-6;
    margin-top: -$space-6;
    padding: $space-8 $space-5;
    border-radius: $radius-xl $radius-xl 0 0;
    background: $color-surface;
    @include safe-area-bottom($space-8);
  }

  .title {
    font-size: 1.625rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .subtitle {
    max-width: 340px;
    margin-top: $space-2;
    font-size: 0.875rem;
    line-height: 1.6;
    color: $color-text-secondary;
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    max-width: 960px;
    min-height: 600px;
    overflow: hidden;
    border-radius: $radius-xl;
    box-shadow: 0 24px 64px rgba($color-navy, 0.12);

    .hero {
      height: auto;
    }

    .hero-content {
      padding: $space-8;
    }

    .photo {
      object-position: 30% center;
    }

    .slide {
      background-position: var(--slide-position-desktop, center);
    }

    .story {
      padding: $space-8;
    }

    .caption-title {
      font-size: 1.375rem;
    }

    .caption-text {
      font-size: 0.875rem;
    }

    .panel {
      justify-content: center;
      margin: 0;
      padding: 48px clamp(32px, 5vw, 56px);
      border-radius: 0;
    }

    .title {
      font-size: 1.875rem;
    }
  }

  @media (max-width: 767px) and (max-height: 640px) {
    .hero {
      height: 180px;
    }

    .story {
      display: none;
    }

    .panel {
      gap: $space-5;
      padding-top: $space-6;
    }
  }
}
.login-story-enter-active,
.login-story-leave-active {
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.login-story-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.login-story-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
