<template>
  <div class="layout">
    <a href="#main" class="skip-link">Перейти до вмісту</a>
    <main id="main" class="layout__main" tabindex="-1">
      <slot />
    </main>
    <AppBottomNav />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100dvh;
}

.layout__main {
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-3) var(--space-2) var(--space-4);
}

.layout__main:focus {
  outline: none;
}
</style>
