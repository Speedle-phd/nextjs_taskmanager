import { z } from 'zod'

export const loginSchema = z.object({
   email: z.string().email().trim(),
   password: z.string().trim()
})

export type FormState =
   | {
        errors?: {
           name?: string[]
           email?: string[]
           password?: string[]
           confirmPassword?: string[]
        }
        message?: string
     }
   | undefined

export const signupSchema = z
   .object({
      email: z.string().email().trim(),
      password: z
         .string()
         .min(8, { message: 'Be at least 8 characters long' })
         .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
         .regex(/[0-9]/, { message: 'Contain at least one number.' })
         .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
         })
         .trim(),
      confirmPassword: z.string().trim(),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
   })
