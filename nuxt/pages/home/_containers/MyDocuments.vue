<script setup lang="ts">
import { FileText } from '@lucide/vue';
import DocumentItem from '../_components/DocumentItem.vue';
import DocumentItemSkeleton from '../_components/DocumentItemSkeleton.vue';

const { documents, status, errorMessage, refresh } = useDocuments();
</script>

<template>
  <section class="my-documents" aria-labelledby="my-documents-title">
    <header class="header">
      <h2 id="my-documents-title" class="title">My Documents</h2>
      <p v-if="documents" class="meta">Alert {{ documents.warningDays }} days before expiry</p>
    </header>

    <BaseCard>
      <ErrorState v-if="status === 'error'" :message="errorMessage" @retry="refresh()" />

      <EmptyState
        v-else-if="documents && documents.items.length === 0"
        :icon="FileText"
        title="No documents"
        description="Your licences and certificates will appear here."
      />

      <ul v-else-if="documents" class="list">
        <DocumentItem v-for="item in documents.items" :key="item.id" :document="item" />
      </ul>

      <div v-else class="loading" aria-busy="true">
        <DocumentItemSkeleton v-for="index in 4" :key="index" />
      </div>
    </BaseCard>
  </section>
</template>

<style scoped lang="scss">
.my-documents {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  min-width: 0;

  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: $space-2;
  }

  .title {
    @include section-title;
  }

  .meta {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }

  .list {
    margin: -6px 0;
  }

  .loading {
    margin: -6px 0;
  }
}
</style>
