
import { serverAuth } from "@/features/auth"

import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET() {

   try {
      const id = await serverAuth()
      if (id instanceof Response) {
         return new Response('Unauthorized', { status: 401 })
      }


      const db_res = await db.query.UserTable.findFirst({
         where: (user, { eq }) => eq(user.id, id),})


      if (!db_res) {
         return new Response('User not found', { status: 404 })
      }
      const {...userInfo} = db_res

      return new Response(JSON.stringify(userInfo), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      console.error('Error fetching user info:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch user info' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }

}

export async function PATCH(req: Request) {
   try {
      const id = await serverAuth()
      if (id instanceof Response) {
         return new Response('Unauthorized', { status: 401 })
      }

      const data = await req.json()

      const filteredData = Object.fromEntries(
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         Object.entries(data).filter(([_, value]) => value !== undefined && value !== ''))

      const db_res = await db.update(UserTable).set(filteredData).where(eq(UserTable.id, id)).returning()

      if (!db_res) {
         return new Response('User not found', { status: 404 })
      }

      return new Response(JSON.stringify({ message: 'User info updated successfully.' }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      console.error('Error updating user info:', error)
      return new Response(JSON.stringify({ error: 'Failed to update user info' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
}