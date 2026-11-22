import { z } from 'zod'

// Спершу нормалізуємо, потім перевіряємо формат: у z.email().trim() перевірка йде до trim
const email = z.string().trim().toLowerCase().pipe(z.email('Невірний email'))

/** Тіло POST /auth/register */
export const RegisterSchema = z.object({
  email,
  password: z.string().min(8, 'Пароль має містити щонайменше 8 символів').max(72),
})
export type RegisterInput = z.infer<typeof RegisterSchema>

/** Тіло POST /auth/login */
export const LoginSchema = z.object({
  email,
  password: z.string().min(1, 'Введіть пароль'),
})
export type LoginInput = z.infer<typeof LoginSchema>

/** Відповідь GET /auth/me */
export const CurrentUserSchema = z.object({
  id: z.string(),
  email: z.email(),
})
export type CurrentUser = z.infer<typeof CurrentUserSchema>
