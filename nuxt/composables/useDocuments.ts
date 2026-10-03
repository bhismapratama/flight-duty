import type { DocumentList } from '~/types/entities/document';

export function useDocuments() {
  const api = useApi();
  const cache = useResponseCache();

  const { data, status, error, refresh } = useAsyncData('documents', () =>
    cache.load('documents', () => api<DocumentList>('/documents')),
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  return { documents: data, status, errorMessage, refresh };
}
