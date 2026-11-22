import { z } from 'zod'

/** Тіло POST /words і форма словника: "кажу → маю на увазі" */
export const WordInputSchema = z.object({
  usedWord: z.string().trim().min(1, 'Вкажіть слово, яке ви кажете').max(100),
  correctWord: z.string().trim().min(1, 'Вкажіть, що ви маєте на увазі').max(100),
  context: z.string().trim().max(500).optional(),
})
export type WordInput = z.infer<typeof WordInputSchema>

/** Тіло PATCH /words/:id */
export const WordUpdateSchema = WordInputSchema.partial()
export type WordUpdate = z.infer<typeof WordUpdateSchema>

/** Слово, як його повертає API */
export const WordMappingSchema = WordInputSchema.extend({
  id: z.string(),
  createdAt: z.iso.datetime(),
})
export type WordMapping = z.infer<typeof WordMappingSchema>
