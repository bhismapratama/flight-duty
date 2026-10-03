<script setup lang="ts">
import LoginForm from './_components/LoginForm.vue';

definePageMeta({ layout: 'auth', public: true });

useHead({ title: 'Sign In · Susi Air Pilot' });
</script>

<template>
  <div class="login-page">
    <section class="hero">
      <img
        src="/images/hero-let-410.jpg"
        alt=""
        class="photo"
        width="1200"
        height="667"
        fetchpriority="high"
      />
      <div class="hero-content">
        <img src="/images/logo-white.png" alt="Susi Air" class="logo" width="120" height="40" />
        <p class="eyebrow">Pilot App</p>
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
    height: clamp(240px, 42dvh, 400px);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba($color-navy, 0.7) 0%,
        rgba($color-navy, 0) 38%,
        rgba($color-navy, 0) 70%,
        rgba($color-navy, 0.5) 100%
      );
    }
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 45% 45%;
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

    .panel {
      gap: $space-5;
      padding-top: $space-6;
    }
  }
}
</style>
