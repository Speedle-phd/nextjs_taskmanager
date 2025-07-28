

import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { serverAuth } from "@/features/auth"
import { eq } from "drizzle-orm"




export async function PATCH(req: Request) {

   try {
      const userId = await serverAuth()
      if (!userId || typeof userId !== "string") {
         return new Response('Unauthorized', { status: 401 })
      }
      const body = await req.json() as { visible: boolean }
      const { visible } = body
      if (typeof visible !== 'boolean') {
         return new Response('Visibility must be a boolean', { status: 400 })
      }
      const db_res = await db.update(UserTable).set({ visible: visible }).where(eq(UserTable.id, userId)).returning()
      if (db_res.length === 0) {
         return new Response('Failed to update visibility', { status: 500 })
      }
      return new Response(JSON.stringify({ visible: visible }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      console.error('Error updating visibility:', error)
      return new Response('Internal Server Error', { status: 500 })
   }

}