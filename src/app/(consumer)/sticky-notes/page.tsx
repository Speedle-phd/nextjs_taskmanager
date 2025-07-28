
import { Caveat } from 'next/font/google'
import AddStickyNote from '@/components/custom/AddStickyNote'
import { Separator } from '@/components/ui/separator'
import { db } from '@/drizzle/db'
import { StickyNotesTable } from '@/drizzle/schema'
import React from 'react'
import { eq } from 'drizzle-orm'
import { serverAuth } from '@/features/auth'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import StickyNoteDeleteButton from '@/components/custom/StickyNoteDeleteButton'

const caveatFont = Caveat({
   subsets: ['latin'],
   weight: "400",
   })

const StickyNotePage = async () => {
   let stickyNotes: (typeof StickyNotesTable.$inferInsert)[] = []
   const authResult = await serverAuth()
   const userId = typeof authResult === 'string' ? authResult : undefined
   if (!userId) {
      return <div className='container mx-auto w-[clamp(20rem,80vw,70rem)] p-4 border-2 shadow-2xl my-2 min-h-[90dvh]'>Unauthorized</div>
   }
   try {
      stickyNotes = await db.select().from(StickyNotesTable).where(eq(StickyNotesTable.userId, userId))
      
   } catch (error) {
      console.error('Error fetching sticky notes:', error)
   }

   

   return (
      <div className='container mx-auto w-[clamp(20rem,80vw,70rem)] p-4 border-2 shadow-2xl my-2 min-h-[90dvh]'>
         <h2 className='text-2xl font-bold mb-4'>Sticky Notes</h2>
         <AddStickyNote />
         <Separator className='my-4 bg-brand' />
         <div className="auto-grid">
            {stickyNotes && stickyNotes.length > 0 ? (
               stickyNotes.map((note) => {
                  const {id, title, priority, dueDate} = note
                  return (
                     <Card
                        key={id}
                        className={cn(
                           'relative border-b p-4 aspect-square rounded-none w-[225px] mx-auto flex items-center justify-center text-black text-pretty shadow-lg shadow-gray-300', `${caveatFont.className}`,
                           priority === 'HIGH'
                              ? 'bg-red-200'
                              : priority === 'MEDIUM'
                              ? 'bg-yellow-200'
                              : 'bg-green-200',
                           dueDate && dueDate < new Date() ? 'bg-red-800 text-white' : ''
                        )}
                     >
                        <h3 className='font-bold text-3xl'>{title}</h3>
                        <StickyNoteDeleteButton id={id!} />
                     </Card>
                  )})
            ) : (
               <div>No notes found yet</div>
            )}
         </div>
      </div>
   )
}

export default StickyNotePage
