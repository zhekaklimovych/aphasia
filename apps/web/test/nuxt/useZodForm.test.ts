import { describe, expect, it, vi } from 'vitest'
import { RegisterSchema } from '@aphasia/shared'

describe('useZodForm', () => {
  it('validate() заповнює помилки за полями', () => {
    const form = useZodForm(RegisterSchema, { email: 'not-an-email', password: '123' })

    expect(form.validate()).toBeNull()
    expect(form.errors.value.email).toBe('Невірний email')
    expect(form.errors.value.password).toContain('8 символів')
  })

  it('validate() повертає нормалізовані дані і очищає помилки', () => {
    const form = useZodForm(RegisterSchema, { email: 'bad', password: '123' })
    form.validate()

    form.values.value = { email: ' Test@Example.com ', password: 'secret123' }

    expect(form.validate()).toEqual({ email: 'test@example.com', password: 'secret123' })
    expect(form.errors.value).toEqual({})
  })

  it('submit() не викликає обробник для невалідної форми', async () => {
    const form = useZodForm(RegisterSchema, { email: '', password: '' })
    const onValid = vi.fn()

    expect(await form.submit(onValid)).toBe(false)
    expect(onValid).not.toHaveBeenCalled()
  })

  it('submit() передає дані обробнику і скидає submitting', async () => {
    const form = useZodForm(RegisterSchema, { email: 'a@b.co', password: 'secret123' })
    const onValid = vi.fn()

    expect(await form.submit(onValid)).toBe(true)
    expect(onValid).toHaveBeenCalledWith({ email: 'a@b.co', password: 'secret123' })
    expect(form.submitting.value).toBe(false)
  })

  it('не змінює переданий об’єкт initial', () => {
    const initial = { email: '', password: '' }
    const form = useZodForm(RegisterSchema, initial)

    form.values.value.email = 'changed@example.com'

    expect(initial.email).toBe('')
  })
})
