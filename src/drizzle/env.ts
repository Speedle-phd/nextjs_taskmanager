
import { z } from 'zod';

const envSchema = z.object({
   DATABASE_URL: z.string().url(),
   JWT_SECRET: z.string().min(1),
   JWT_EXPIRATION_TIME: z.string().min(1).default('24h'),
   EMAIL_TOKEN: z.string().min(1),
   BASE_URL: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)