import { z } from 'zod'

export const SeveritySchema = z.enum(['MILD', 'MODERATE', 'SEVERE'])
export type Severity = z.infer<typeof SeveritySchema>

export const PaceSchema = z.enum(['slow', 'normal', 'fast'])
export type Pace = z.infer<typeof PaceSchema>

/** Тіло PUT /profile і форма профілю */
export const ProfileInputSchema = z.object({
  firstName: z.string().trim().min(1, "Вкажіть ім'я").max(50),
  birthDate: z.iso.date('Дата у форматі РРРР-ММ-ДД').optional(),
  language: z.string().trim().min(2).max(10).default('uk'),
  disorderType: z.string().trim().max(100).optional(),
  severity: SeveritySchema.optional(),
  preferredPace: PaceSchema.default('normal'),
  occupation: z.string().trim().max(100).optional(),
  hobbies: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
})
export type ProfileInput = z.input<typeof ProfileInputSchema>
export type Profile = z.output<typeof ProfileInputSchema>
