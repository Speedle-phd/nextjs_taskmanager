

import { db } from "@/drizzle/db"
import { headers } from "next/headers"



export async function GET() {

   try {
      const headerStore = await headers()
      const id = headerStore.get('x-user-id')

      if (!id) {
         return new Response(JSON.stringify({ error: 'User ID not provided' }), {
            status: 400,
            headers: {
               'Content-Type': 'application/json',
            },
         })
      }

      const db_res = await db.query.UserTable.findFirst({
         where: (user, { eq }) => eq(user.id, id),})


      if (!db_res) {
         return new Response('User not found', { status: 404 })
      }
      const {...userInfo} = db_res

      return new Response(JSON.stringify({verified: userInfo.verified}), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      if(error){
         console.error('Error fetching user info')
         return new Response(JSON.stringify({ error: 'Failed to fetch verification status' }), {
            status: 500,
            headers: {
               'Content-Type': 'application/json',
            },
         })
      }
   }

}