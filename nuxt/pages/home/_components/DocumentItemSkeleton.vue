<template>
  <div class="document-item-skeleton" aria-hidden="true">
    <BaseSkeleton width="40px" height="40px" radius="12px" />
    <div class="body">
      <BaseSkeleton width="68%" height="12px" radius="4px" />
      <div class="meta">
        <BaseSkeleton width="30%" height="10px" radius="4px" />
        <BaseSkeleton width="76px" height="22px" radius="999px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.document-item-skeleton {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: 14px 0;

  & + & {
    border-top: 1px solid $color-border;
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: $space-2;
    min-width: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }
}
</style>
