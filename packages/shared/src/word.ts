import { z } from 'zod'
import { optionalText } from './common'

/** Тіло POST /words і форма словника: "кажу → маю на увазі" */
export const WordInputSchema = z.object({
  usedWord: z.string().trim().min(1, 'Вкажіть слово, яке ви кажете').max(100),
  correctWord: z.string().trim().min(1, 'Вкажіть, що ви маєте на увазі').max(100),
  context: optionalText(500),
})
export type WordInput = z.output<typeof WordInputSchema>

/** Тіло PATCH /words/:id */
export const WordUpdateSchema = WordInputSchema.partial()
export type WordUpdate = z.output<typeof WordUpdateSchema>

/** Слово, як його повертає API */
export const WordMappingSchema = WordInputSchema.extend({
  id: z.string(),
  createdAt: z.iso.datetime(),
})
export type WordMapping = z.output<typeof WordMappingSchema>
