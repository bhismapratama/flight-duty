<template>
  <div class="limit-card-skeleton" aria-hidden="true">
    <div class="row">
      <BaseSkeleton width="52px" height="10px" radius="4px" />
      <BaseSkeleton width="28px" height="10px" radius="4px" />
    </div>
    <div class="value">
      <BaseSkeleton width="62%" height="24px" radius="6px" />
    </div>
    <BaseSkeleton height="6px" radius="999px" />
    <div class="row is-footer">
      <BaseSkeleton width="38%" height="9px" radius="4px" />
      <BaseSkeleton width="30%" height="9px" radius="4px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.limit-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: 14px;
  @include card;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
    height: 18px;

    &.is-footer {
      height: 16.5px;
      margin-top: 4px;
    }
  }

  .value {
    display: flex;
    align-items: center;
    height: 29px;
  }

  @media (min-width: 400px) {
    padding: $space-4;

    .value {
      height: 31.2px;
    }
  }
}
</style>
