import type { DocumentList } from '~/types/entities/document';

export function useDocuments() {
  const api = useApi();

  const { data, status, error, refresh } = useAsyncData('documents', () =>
    api<DocumentList>('/documents'),
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  return { documents: data, status, errorMessage, refresh };
}
