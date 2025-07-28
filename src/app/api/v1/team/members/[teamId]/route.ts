import { db } from "@/drizzle/db"
import { UserTable, UserTeamTable } from "@/drizzle/schema"
import { serverAuth } from "@/features/auth"
import { eq } from "drizzle-orm"

export async function GET(
   _: Request,
   { params }: { params: Promise<{ teamId: string }> }
) {
   const userId = await serverAuth()
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }

   const { teamId } = await params
   if (!teamId) {
      return new Response('Team ID is required', { status: 400 })
   }

   try {
      const db_res = await db
         .select()
         .from(UserTeamTable)
         .leftJoin(UserTable, eq(UserTeamTable.userId, UserTable.id))
         .where(eq(UserTeamTable.teamId, teamId))

      if (!db_res || db_res.length === 0) {
         return new Response('No members found for this team', { status: 404 })
      }

      return new Response(JSON.stringify({ members: db_res.map(i => i.users) }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   } catch (error) {
      console.error('Error fetching team members:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}