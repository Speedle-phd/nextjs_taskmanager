import { db } from "@/drizzle/db"
import { serverAuth } from "@/features/auth"
import { and, sql } from "drizzle-orm"

//get users with search term
export async function POST(req: Request) {
   try {
      const id = await serverAuth()
      if (id instanceof Response) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      const data = await req.json()

      const { searchTerm } = data
      if ( searchTerm === undefined || searchTerm === '' || searchTerm.length < 2) {
         return new Response(JSON.stringify({ users:[] }), {
            status: 200,
            headers: {
               'Content-Type': 'application/json',
            },
         })
      }
      //combine fname with lname and search for it
      const users = await db.query.UserTable.findMany({
         where: (user, { ilike }) => and(user.visible, (ilike(sql`concat(${user.fname}, ' ', ${user.lname})`, `%${searchTerm}%`))),
         orderBy: (user, { asc }) => [asc(user.email)],
         limit: 5,
         
      })

      return new Response(JSON.stringify({ users }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      console.error( error)
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }

}