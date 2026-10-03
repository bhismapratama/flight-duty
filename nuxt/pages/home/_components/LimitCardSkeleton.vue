<template>
  <div class="limit-card-skeleton" aria-hidden="true">
    <div class="row">
      <BaseSkeleton width="52px" height="10px" radius="4px" />
      <BaseSkeleton width="28px" height="10px" radius="4px" />
    </div>
    <BaseSkeleton width="62%" height="24px" radius="6px" />
    <BaseSkeleton height="6px" radius="999px" />
    <div class="row">
      <BaseSkeleton width="38%" height="9px" radius="4px" />
      <BaseSkeleton width="30%" height="9px" radius="4px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.limit-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  @include card;

  .row {
    display: flex;
    justify-content: space-between;
    gap: $space-2;
  }

  @media (min-width: 400px) {
    padding: $space-4;
  }
}
</style>
