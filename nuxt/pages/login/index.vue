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
  min-height: 100dvh;
  background: $color-navy;

  .hero {
    position: relative;
    height: 38dvh;
    min-height: 220px;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba($color-navy, 0.55) 0%,
        rgba($color-navy, 0.2) 45%,
        $color-navy 100%
      );
    }
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
  }

  .hero-content {
    position: absolute;
    inset: 0 0 auto;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-5;
    @include safe-area-top($space-5);
  }

  .logo {
    width: 104px;
    height: auto;
  }

  .eyebrow {
    padding: 4px 12px;
    border-radius: $radius-pill;
    background: rgba($color-surface, 0.16);
    color: $color-surface;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
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
    border-radius: 24px 24px 0 0;
    background: $color-surface;
    @include safe-area-bottom($space-8);
  }

  .title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .subtitle {
    margin-top: $space-1;
    color: $color-text-secondary;
  }
}
</style>
