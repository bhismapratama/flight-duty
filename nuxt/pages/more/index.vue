<script setup lang="ts">
import { FileText, LogOut } from '@lucide/vue';
import DetailList, { type DetailItem } from './_components/DetailList.vue';
import DetailListSkeleton from './_components/DetailListSkeleton.vue';
import MenuRow from './_components/MenuRow.vue';
import DocumentOverview from './_containers/DocumentOverview.vue';

useHead({ title: 'More · Susi Air Pilot' });

const auth = useAuthStore();
const pilot = usePilotStore();
const config = useRuntimeConfig();
const signingOut = ref(false);

onMounted(() => {
  pilot.fetchProfile();
});

const accountItems = computed<DetailItem[]>(() => {
  const profile = pilot.profile;
  if (!profile) {
    return [];
  }
  return [
    { label: 'Username', value: `@${profile.username}` },
    { label: 'Pilot ID', value: profile.id },
    { label: 'Total flight hours', value: `${formatHours(profile.totalFlightHours)} h` },
    ...(profile.plannedFlightHours > 0
      ? [
          {
            label: 'Planned flight hours',
            value: `${formatHours(profile.plannedFlightHours)} h to ${formatShortDate(profile.plannedUntil)}`,
          },
        ]
      : []),
  ];
});

const appItems = computed<DetailItem[]>(() => [
  { label: 'Version', value: config.public.appVersion },
  { label: 'Platform', value: isNativePlatform() ? 'Android app' : 'Web app' },
  { label: 'Operational date', value: pilot.today ? formatDate(pilot.today) : '–' },
]);

async function signOut(): Promise<void> {
  signingOut.value = true;
  await auth.logout();
  await navigateTo('/login', { replace: true });
}
</script>

<template>
  <div class="more-page">
    <header class="hero">
      <h1 class="heading">More</h1>
    </header>
    <div class="body">
      <BaseCard class="profile">
        <template v-if="pilot.profile">
          <BaseAvatar :src="pilot.profile.avatarUrl" :name="pilot.profile.name" :size="56" />
          <div>
            <p class="name">{{ pilot.profile.name }}</p>
            <p class="meta">Pilot · Susi Air</p>
          </div>
        </template>
        <template v-else>
          <BaseSkeleton width="56px" height="56px" radius="50%" />
          <div class="name-skeleton">
            <BaseSkeleton width="140px" height="16px" radius="6px" />
            <BaseSkeleton width="96px" height="11px" radius="4px" />
          </div>
        </template>
      </BaseCard>

      <DocumentOverview />

      <section class="section" aria-labelledby="more-account-title">
        <h2 id="more-account-title" class="title">Account</h2>
        <BaseCard>
          <ErrorState
            v-if="pilot.status === 'error'"
            compact
            :message="pilot.errorMessage"
            @retry="pilot.fetchProfile(true)"
          />
          <DetailList v-else-if="accountItems.length" :items="accountItems" />
          <DetailListSkeleton v-else :rows="3" />
        </BaseCard>
      </section>

      <section class="section" aria-labelledby="more-app-title">
        <h2 id="more-app-title" class="title">App</h2>
        <BaseCard>
          <DetailList :items="appItems" />
        </BaseCard>
      </section>

      <BaseCard class="menu">
        <ul>
          <MenuRow :icon="FileText" label="My documents" to="/home#my-documents-title" />
          <MenuRow :icon="LogOut" label="Sign Out" danger :loading="signingOut" @click="signOut" />
        </ul>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
$more-overlap: 56px;

.more-page {
  .hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: $space-4 $space-4 calc(#{$space-6} + #{$more-overlap});
    border-radius: 0 0 $radius-xl $radius-xl;
    background: $color-navy;
    color: $color-surface;
    @include safe-area-top($space-4);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        linear-gradient(
          180deg,
          rgba($color-navy, 0.2) 0%,
          rgba($color-navy, 0.35) 45%,
          rgba($color-navy, 0.9) 100%
        ),
        url('/images/cover-sky.webp') 50% 60% / cover no-repeat;
    }
  }

  .heading {
    padding-top: 56px;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    @include page-width;
  }

  .body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $space-6;
    margin-top: -$more-overlap;
    padding: 0 $space-4;
    @include page-width;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: $space-4;
    box-shadow: $shadow-float;
  }

  .name-skeleton {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  .name {
    font-size: 1.0625rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;
  }

  .meta {
    margin-top: 2px;
    font-size: 0.8125rem;
    color: $color-text-secondary;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .title {
    @include section-title;
  }

  .menu {
    padding-block: $space-1;
  }

  @media (min-width: 768px) {
    .hero {
      margin-top: $space-6;
      padding-inline: $space-8;
      border-radius: $radius-xl;
    }

    .heading {
      padding-top: 72px;
      font-size: 1.75rem;
    }

    .body {
      padding-inline: 0;
    }

    .profile {
      padding: $space-5;
    }
  }
}
</style>
