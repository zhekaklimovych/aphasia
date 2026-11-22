import { z } from 'zod'
import { optionalText } from './common'

export const SeveritySchema = z.enum(['MILD', 'MODERATE', 'SEVERE'])
export type Severity = z.infer<typeof SeveritySchema>

export const PaceSchema = z.enum(['slow', 'normal', 'fast'])
export type Pace = z.infer<typeof PaceSchema>

/** Тіло PUT /profile і форма профілю. Порожні необовʼязкові поля стають undefined. */
export const ProfileInputSchema = z.object({
  firstName: z.string().trim().min(1, "Вкажіть ім'я").max(50),
  birthDate: z
    .union([z.iso.date('Дата у форматі РРРР-ММ-ДД'), z.literal('')])
    .transform((value) => value || undefined)
    .optional(),
  language: z.string().trim().min(2).max(10).default('uk'),
  disorderType: optionalText(100),
  severity: z
    .union([SeveritySchema, z.literal('')])
    .transform((value) => value || undefined)
    .optional(),
  preferredPace: PaceSchema.default('normal'),
  occupation: optionalText(100),
  hobbies: z.array(z.string().trim().min(1).max(50)).max(20, 'Не більше 20 захоплень').default([]),
})
export type ProfileInput = z.input<typeof ProfileInputSchema>
export type Profile = z.output<typeof ProfileInputSchema>
