
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import React from 'react'
import { Card } from '../ui/card'
import Link from 'next/link'
type Props = {
   id: string
   teamLeader: string
   name: string
   description?: string
}
const TeamTile = async({name,id,teamLeader,description}:Props) => {
   try {
      const teamLeaderData = await db.select().from(UserTable).where(eq(UserTable.id, teamLeader))

      if (teamLeaderData.length > 0) {
         teamLeader = teamLeaderData[0].fname + " " + teamLeaderData[0].lname || 'Unknown Leader'
      } else {
         teamLeader = 'Unknown Leader'
      }

   } catch (error) {
      console.error(error)
   }
  return (
    <Link href="/teams/manage/[id]" as={`/teams/manage/${id}`} className='no-underline'>
       <Card className='p-4 flex flex-col gap-2 shadow-brand hover:shadow-lg transition-shadow duration-200'>
         <p>{id}</p>
         <h3 className='text-lg font-semibold'>{name}</h3>
         <p className='text-sm text-muted-foreground'>Team Leader: {teamLeader}</p>
         {description && <p className='text-sm text-muted-foreground'>{description}</p>}
       </Card>
    </Link>
  )
}

export default TeamTile
