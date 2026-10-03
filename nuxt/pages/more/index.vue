<script setup lang="ts">
import { LogOut } from '@lucide/vue';
import DetailList, { type DetailItem } from './_components/DetailList.vue';
import DetailListSkeleton from './_components/DetailListSkeleton.vue';
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
    <PageHeader title="More" />
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
          <BaseSkeleton width="62px" height="62px" radius="50%" class="avatar-skeleton" />
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

      <BaseButton variant="secondary" block :loading="signingOut" @click="signOut">
        <LogOut :size="18" aria-hidden="true" />
        Sign Out
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.more-page {
  .body {
    display: flex;
    flex-direction: column;
    gap: $space-6;
    padding: 0 $space-4;
    @include page-width;
  }

  .profile {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-3;
    overflow: hidden;
    padding: 40px $space-4 $space-4;

    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      z-index: -1;
      height: 72px;
      background:
        linear-gradient(180deg, rgba($color-navy, 0.15), rgba($color-navy, 0.45)),
        url('/images/cover-sky.webp') 50% 55% / cover no-repeat;
    }

    :deep(.base-avatar) {
      border: 3px solid $color-surface;
    }
  }

  .avatar-skeleton {
    box-shadow: 0 0 0 3px $color-surface;
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
  }

  .meta {
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    color: $color-text-secondary;
    overflow-wrap: anywhere;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .title {
    @include section-title;
  }

  @media (min-width: 768px) {
    .body {
      padding-inline: 0;
    }

    .profile {
      padding: 56px $space-5 $space-5;

      &::before {
        height: 88px;
      }
    }
  }
}
</style>
