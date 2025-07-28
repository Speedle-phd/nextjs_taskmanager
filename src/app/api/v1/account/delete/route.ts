import { cookies } from "next/headers"
import { getUserIdFromToken } from "../../../../../../lib/session"

import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"

export async function DELETE(){
   try {
         const cookieStore = await cookies()
         const token = cookieStore.get('task_manager_token')
         if (!token) {
            return new Response('Unauthorized', { status: 401 })
         }
         
         const userId = await getUserIdFromToken(token)

         if (!userId) {
            return new Response('Unauthorized', { status: 401 })
         }

         const db_res = await db.update(UserTable).set({
            deprecated: true,
            deprecatedAt: new Date(),
            verified: false,
            password: null,
         })
         if (!db_res) {
            return new Response('User not found', { status: 404 })
         }
         cookieStore.delete('task_manager_token') // Delete the token cookie
         return new Response('Account deleted successfully', { status: 200 })


   } catch (error) {
      console.error('Error deleting account:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete the account' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
   })}
}