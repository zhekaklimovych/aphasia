import { z } from 'zod'

export const AnswerSchema = z.enum(['YES', 'NO', 'SKIP'])
export type Answer = z.infer<typeof AnswerSchema>

export const MessageRoleSchema = z.enum(['USER_INPUT', 'AI_QUESTION', 'USER_ANSWER', 'AI_RESULT'])
export type MessageRole = z.infer<typeof MessageRoleSchema>

export const SessionStatusSchema = z.enum(['ACTIVE', 'COMPLETED', 'ABANDONED'])
export type SessionStatus = z.infer<typeof SessionStatusSchema>

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
})
export type Question = z.infer<typeof QuestionSchema>

export const DialogResultSchema = z.object({
  interpretation: z.string().min(1),
  /** Впевненість від 0 до 1. У відсотки перетворює інтерфейс. */
  confidence: z.number().min(0).max(1),
})
export type DialogResult = z.infer<typeof DialogResultSchema>

export const HistoryEntrySchema = z.object({
  question: QuestionSchema,
  answer: AnswerSchema,
})
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>

/** Тіло POST /sessions */
export const StartSessionSchema = z.object({
  initialInput: z.string().trim().min(1, 'Введіть слово або фразу').max(500),
})
export type StartSessionInput = z.infer<typeof StartSessionSchema>

/** Тіло POST /sessions/:id/answer */
export const AnswerInputSchema = z.object({
  answer: AnswerSchema,
})
export type AnswerInput = z.infer<typeof AnswerInputSchema>

/** Тіло POST /sessions/:id/feedback */
export const FeedbackInputSchema = z.object({
  wasCorrect: z.boolean(),
  feedback: z.string().trim().max(1000).optional(),
})
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>
