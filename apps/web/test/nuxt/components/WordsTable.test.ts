import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { WordMapping } from '@aphasia/shared'
import WordsTable from '~/components/words/WordsTable.vue'

const words: WordMapping[] = [
  { id: '1', usedWord: 'чашка', correctWord: 'чайник', createdAt: '2026-11-20T09:00:00.000Z' },
  {
    id: '2',
    usedWord: 'біла',
    correctWord: 'молоко',
    context: 'на сніданок',
    createdAt: '2026-11-21T09:00:00.000Z',
  },
  { id: '3', usedWord: 'їсти', correctWord: 'обід', createdAt: '2026-11-19T09:00:00.000Z' },
]

async function mountTable() {
  return mountSuspended(WordsTable, { props: { words } })
}

function firstColumn(wrapper: Awaited<ReturnType<typeof mountTable>>) {
  return wrapper.findAll('tbody tr').map((row) => row.find('td').text())
}

describe('WordsTable', () => {
  it('показує всі слова', async () => {
    const wrapper = await mountTable()

    expect(firstColumn(wrapper)).toEqual(['чашка', 'біла', 'їсти'])
  })

  it('сортує за абеткою з урахуванням української (ї після і, перед к)', async () => {
    const wrapper = await mountTable()
    const sortButton = wrapper.findAll('thead button')[0]

    await sortButton?.trigger('click')
    expect(firstColumn(wrapper)).toEqual(['біла', 'їсти', 'чашка'])
    expect(wrapper.find('thead th').attributes('aria-sort')).toBe('ascending')

    await sortButton?.trigger('click')
    expect(firstColumn(wrapper)).toEqual(['чашка', 'їсти', 'біла'])
    expect(wrapper.find('thead th').attributes('aria-sort')).toBe('descending')
  })

  it('шукає по слову, значенню і контексту', async () => {
    const wrapper = await mountTable()
    const search = wrapper.find('input[type="search"]')

    await search.setValue('ЧАЙ')
    expect(firstColumn(wrapper)).toEqual(['чашка'])

    await search.setValue('сніданок')
    expect(firstColumn(wrapper)).toEqual(['біла'])
    expect(wrapper.text()).toContain('Знайдено: 1')
  })

  it('показує повідомлення, якщо нічого не знайдено', async () => {
    const wrapper = await mountTable()

    await wrapper.find('input[type="search"]').setValue('немає такого')

    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
    expect(wrapper.text()).toContain('Нічого не знайдено')
  })

  it('емітить edit і remove з потрібним словом', async () => {
    const wrapper = await mountTable()
    const secondRowButtons = wrapper.findAll('tbody tr')[1]?.findAll('button')

    await secondRowButtons?.[0]?.trigger('click')
    await secondRowButtons?.[1]?.trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[words[1]]])
    expect(wrapper.emitted('remove')).toEqual([[words[1]]])
  })
})
