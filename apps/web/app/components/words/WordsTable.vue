<script setup lang="ts">
import type { WordMapping } from '@aphasia/shared'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortFn,
  type Updater,
} from '@tanstack/vue-table'

const props = defineProps<{
  words: WordMapping[]
}>()

const emit = defineEmits<{
  edit: [word: WordMapping]
  remove: [word: WordMapping]
}>()

// Фічі й колонки створюємо один раз: TanStack вимагає стабільних посилань
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})

// Сортування з урахуванням українського алфавіту (і, ї, є, ґ на своїх місцях)
const byUkrainian: SortFn<typeof features, WordMapping> = (a, b, columnId) =>
  String(a.getValue(columnId) ?? '').localeCompare(String(b.getValue(columnId) ?? ''), 'uk')

const helper = createColumnHelper<typeof features, WordMapping>()
const columns = helper.columns([
  helper.accessor('usedWord', { header: 'Я кажу', sortFn: byUkrainian }),
  helper.accessor('correctWord', { header: 'Маю на увазі', sortFn: byUkrainian }),
  helper.accessor('context', { header: 'Коли', sortFn: byUkrainian, sortUndefined: 'last' }),
  helper.accessor('createdAt', { header: 'Додано', sortFn: byUkrainian }),
  helper.display({ id: 'actions', header: 'Дії' }),
])

const searchable = new Set(['usedWord', 'correctWord', 'context'])
const search = ref('')
const state = computed(() => ({ globalFilter: search.value }))

const table = useTable({
  features,
  columns,
  data: computed(() => props.words),
  getRowId: (word: WordMapping) => word.id,
  state,
  onGlobalFilterChange: (next: Updater<string>) => {
    search.value = typeof next === 'function' ? next(search.value) : next
  },
  globalFilterFn: 'includesString',
  getColumnCanGlobalFilter: (column) => searchable.has(column.id),
})

const rows = computed(() => table.getRowModel().rows)

function ariaSort(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return 'ascending'
  if (sorted === 'desc') return 'descending'
  return 'none'
}

function sortIcon(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return '▲'
  if (sorted === 'desc') return '▼'
  return '↕'
}
</script>

<template>
  <div class="words-table">
    <FormTextField v-model="search" label="Пошук у словнику" type="search" />
    <p role="status" class="page__text">
      {{ search.trim() ? `Знайдено: ${rows.length}` : '' }}
    </p>

    <div class="words-table__scroll">
      <table class="words-table__table">
        <caption class="visually-hidden">
          Слова у словнику. Натисніть на заголовок стовпця, щоб відсортувати.
        </caption>
        <thead>
          <tr v-for="group in table.getHeaderGroups()" :key="group.id">
            <th
              v-for="header in group.headers"
              :key="header.id"
              scope="col"
              :aria-sort="
                header.column.getCanSort() ? ariaSort(header.column.getIsSorted()) : undefined
              "
            >
              <button
                v-if="header.column.getCanSort()"
                type="button"
                class="words-table__sort"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                {{ header.column.columnDef.header }}
                <span aria-hidden="true">{{ sortIcon(header.column.getIsSorted()) }}</span>
              </button>
              <template v-else>{{ header.column.columnDef.header }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <strong>{{ row.original.usedWord }}</strong>
            </td>
            <td>{{ row.original.correctWord }}</td>
            <td class="words-table__muted">{{ row.original.context ?? '—' }}</td>
            <td class="words-table__muted">{{ formatDate(row.original.createdAt) }}</td>
            <td>
              <div class="words-table__actions">
                <button type="button" class="words-table__link" @click="emit('edit', row.original)">
                  Редагувати
                </button>
                <button
                  type="button"
                  class="words-table__link words-table__link--danger"
                  @click="emit('remove', row.original)"
                >
                  Видалити
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!rows.length" class="page__text">
      {{ search.trim() ? 'Нічого не знайдено.' : 'Словник поки порожній.' }}
    </p>
  </div>
</template>

<style scoped>
.words-table {
  display: grid;
  gap: var(--space-2);
}

.words-table__scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.words-table__table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--space-1) var(--space-2);
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--color-border);
}

tbody tr:last-child td {
  border-bottom: none;
}

th {
  font-size: 0.9rem;
  white-space: nowrap;
}

.words-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 2.75rem;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font-weight: 700;
  cursor: pointer;
}

.words-table__muted {
  color: var(--color-text-muted);
}

.words-table__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.words-table__link {
  min-height: 2.75rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-link);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.words-table__link--danger {
  color: var(--color-error-text);
}
</style>
