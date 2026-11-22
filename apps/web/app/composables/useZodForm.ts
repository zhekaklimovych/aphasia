import type { Ref } from 'vue'
import type { z } from 'zod'

type FieldErrors<T> = Partial<Record<keyof T, string>>

/**
 * Стан форми з валідацією за спільною Zod-схемою.
 * validate() повертає перевірені дані (вже обрізані, з дефолтами) або null і заповнює errors.
 */
export function useZodForm<S extends z.ZodObject>(schema: S, initial: z.input<S>) {
  const values = ref(structuredClone(initial)) as Ref<z.input<S>>
  const errors = ref<FieldErrors<z.input<S>>>({}) as Ref<FieldErrors<z.input<S>>>
  const submitting = ref(false)

  function validate(): z.output<S> | null {
    const result = schema.safeParse(values.value)
    if (result.success) {
      errors.value = {}
      return result.data
    }

    const next: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      // Показуємо лише першу помилку для кожного поля
      if (typeof field === 'string' && !(field in next)) next[field] = issue.message
    }
    errors.value = next as FieldErrors<z.input<S>>
    return null
  }

  /** Перевіряє форму і, якщо все добре, викликає onValid. Повертає true при успіху. */
  async function submit(onValid: (data: z.output<S>) => Promise<void> | void) {
    const data = validate()
    if (!data) return false

    submitting.value = true
    try {
      await onValid(data)
      return true
    } finally {
      submitting.value = false
    }
  }

  return { values, errors, submitting, validate, submit }
}

/** Ставить фокус на перше поле з помилкою, щоб користувач клавіатури одразу його побачив. */
export async function focusFirstInvalid(root: HTMLElement | null | undefined) {
  await nextTick()
  root?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}
