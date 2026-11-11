export type Answer = 'YES' | 'NO' | 'SKIP'

export type DialogStatus = 'idle' | 'asking' | 'result' | 'done'

export interface Question {
  id: string
  text: string
}

export interface DialogResult {
  interpretation: string
  /** Впевненість від 0 до 1. У відсотки перетворює інтерфейс. */
  confidence: number
}

export interface HistoryEntry {
  question: Question
  answer: Answer
}
