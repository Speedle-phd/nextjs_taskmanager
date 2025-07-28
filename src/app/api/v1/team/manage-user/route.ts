import { db } from '@/drizzle/db'
import { UserTable, UserTeamTable } from '@/drizzle/schema'
import { serverAuth } from '@/features/auth'
import { and, eq } from 'drizzle-orm'

export async function POST(req: Request) {
   try {
      await serverAuth()
      const data = await req.json()
      const email = data.email

      const addedUser = await db
         .select()
         .from(UserTable)
         .where(eq(UserTable.email, email))
      if (addedUser.length === 0) {
         return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: {
               'Content-Type': 'application/json',
            },
         })
      }
      const userId = addedUser[0].id
      const db_res = await db
         .insert(UserTeamTable)
         .values({
            userId: userId,
            teamId: data.teamId,
         })
         .onConflictDoNothing()
         .returning()
      if (db_res.length === 0) {
         return new Response(
            JSON.stringify({ error: 'Failed to add user to team' }),
            {
               status: 500,
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         )
      }

      return new Response(JSON.stringify({message: "User added to team successfully"}), {
         status: 200,
      })
   } catch (error) {
      console.error('Error adding user to team:', error)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
}

export async function DELETE(req: Request) {
   try {
      await serverAuth()
      const data = await req.json()
      const teamId = data.teamId
      const userId = data.userId

      const db_res = await db
         .delete(UserTeamTable)
         .where(and(eq(UserTeamTable.userId, userId), eq(UserTeamTable.teamId, teamId)))
         .returning()
      if (db_res.length === 0) {
         return new Response(
            JSON.stringify({ error: 'Failed to remove user from team' }),
            {
               status: 500,
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         )
      }

      return new Response(
         JSON.stringify({ message: 'User removed from team successfully' }),
         {
            status: 200,
         }
      )
   } catch (error) {
      console.error('Error removing user from team:', error)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
}
