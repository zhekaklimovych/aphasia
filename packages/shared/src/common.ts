import { z } from 'zod'

/** Необовʼязковий текст: порожній рядок з форми стає undefined. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || undefined)
    .optional()
