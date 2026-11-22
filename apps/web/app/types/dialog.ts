// Типи даних (Question, Answer, DialogResult...) живуть у @aphasia/shared.
// Тут лише клієнтський UI-стан діалогу.
export type DialogStatus = 'idle' | 'asking' | 'result' | 'done'
