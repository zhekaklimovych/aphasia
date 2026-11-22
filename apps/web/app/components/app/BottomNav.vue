<script setup lang="ts">
const links = [
  { to: '/', label: 'Діалог' },
  { to: '/history', label: 'Історія' },
  { to: '/words', label: 'Словник' },
  { to: '/profile', label: 'Профіль' },
] as const
</script>

<template>
  <nav class="bottom-nav" aria-label="Головна навігація">
    <ul class="bottom-nav__list">
      <li v-for="link in links" :key="link.to">
        <!-- NuxtLink сам ставить aria-current="page" на активному посиланні -->
        <NuxtLink :to="link.to" class="bottom-nav__link">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  background: var(--color-surface);
  border-top: 2px solid var(--color-border);
}

.bottom-nav__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 40rem;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.bottom-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4rem;
  padding: var(--space-1);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.bottom-nav__link[aria-current='page'] {
  color: var(--color-link);
  box-shadow: inset 0 4px 0 var(--color-link);
}
</style>
