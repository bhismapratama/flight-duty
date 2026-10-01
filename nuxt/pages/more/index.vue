<script setup lang="ts">
import { LogOut } from '@lucide/vue';

useHead({ title: 'More · Susi Air Pilot' });

const auth = useAuthStore();
const pilot = usePilotStore();
const signingOut = ref(false);

onMounted(() => {
  pilot.fetchProfile();
});

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
            <p class="meta">
              @{{ pilot.profile.username }} · {{ formatHours(pilot.profile.totalFlightHours) }} h
            </p>
          </div>
        </template>
        <template v-else>
          <BaseSkeleton width="56px" height="56px" radius="50%" />
          <BaseSkeleton width="160px" height="18px" />
        </template>
      </BaseCard>

      <ComingSoon
        title="More settings coming soon"
        description="Profile, notifications and app preferences will live here."
      />

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
    gap: $space-4;
    padding: 0 $space-4;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  .name {
    font-weight: 800;
    font-size: 1.05rem;
  }

  .meta {
    font-size: 0.8rem;
    color: $color-text-secondary;
  }
}
</style>
