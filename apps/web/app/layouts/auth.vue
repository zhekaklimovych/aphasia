<template>
  <main class="auth-layout">
    <div class="auth-layout__card">
      <p class="auth-layout__brand">Aphasia Helper</p>
      <slot />
    </div>
  </main>
</template>

<style scoped>
.auth-layout {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-2);
}

.auth-layout__card {
  display: grid;
  gap: var(--space-3);
  width: 100%;
  max-width: 28rem;
  padding: var(--space-4) var(--space-3);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.auth-layout__brand {
  margin: 0;
  color: var(--color-text-muted);
  font-weight: 600;
}
</style>
