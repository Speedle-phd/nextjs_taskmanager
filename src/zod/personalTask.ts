import {z} from 'zod'

export const personalTaskSchema = z.object({
   title: z.string().min(3, {message: 'Title is required'}).trim(),
   description: z.string().min(3).trim().optional(),
   dueDate: z.date().optional().refine((date) => {
      if (!date) return true; // If no date is provided, skip validation
      return date > new Date()}, {
      message: 'Due date must be in the future'}),
   priority: z.enum(['low', 'medium', 'high']).optional(),
})