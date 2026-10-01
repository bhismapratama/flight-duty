interface LoginFieldErrors {
  username?: string;
  password?: string;
}

export function useLogin() {
  const auth = useAuthStore();

  const form = reactive({ username: '', password: '' });
  const fieldErrors = reactive<LoginFieldErrors>({});
  const submitError = ref<string | null>(null);
  const pending = ref(false);

  function validate(): boolean {
    fieldErrors.username = form.username.trim() ? undefined : 'Username is required';
    fieldErrors.password = form.password ? undefined : 'Password is required';
    return !fieldErrors.username && !fieldErrors.password;
  }

  async function submit(): Promise<void> {
    submitError.value = null;
    if (!validate()) {
      return;
    }

    pending.value = true;
    try {
      await auth.login({ username: form.username.trim(), password: form.password });
      await navigateTo('/home', { replace: true });
    } catch (error) {
      submitError.value =
        getErrorStatus(error) === 401
          ? 'Incorrect username or password. Please check your credentials and try again.'
          : getErrorMessage(error);
    } finally {
      pending.value = false;
    }
  }

  watch(
    () => [form.username, form.password],
    () => {
      submitError.value = null;
    },
  );

  return { form, fieldErrors, submitError, pending, submit };
}
