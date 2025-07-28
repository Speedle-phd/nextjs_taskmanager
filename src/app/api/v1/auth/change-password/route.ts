import { cookies } from 'next/headers'

import bcrypt from 'bcrypt'
import { getUserIdFromToken } from '../../../../../../lib/session'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: Request) {
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   if (!token) {
      return new Response('Unauthorized', { status: 401 })
   }

   const userId = await getUserIdFromToken(token)
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }

   try {
      const { password } = await req.json()

      if (!password) {
         return new Response(
            JSON.stringify({ error: 'Password is required.' }),
            {
               status: 400,
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         )
      }
      const hashedPassword = bcrypt.hashSync(password, 10) // Hash the new password before storing it

      const db_res = await db.update(UserTable).set({password: hashedPassword}).where(eq(UserTable.id, userId)).returning()

      if (!db_res) {
         return new Response(JSON.stringify({ error: 'User not found.' }), {
            status: 404,
            headers: {
               'Content-Type': 'application/json',
            },
         })
      }

      return new Response(
         JSON.stringify({ message: 'Password changed successfully.' }),
         {
            status: 200,
            headers: {
               'Content-Type': 'application/json',
            },
         }
      )
   } catch (error) {
      console.error('Error changing password:', error)
      return new Response(
         JSON.stringify({ error: 'Failed to change password.' }),
         {
            status: 500,
            headers: {
               'Content-Type': 'application/json',
            },
         }
      )
   }
}
