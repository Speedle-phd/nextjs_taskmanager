import { db } from "@/drizzle/db"
import { StickyNotesTable } from "@/drizzle/schema"
import { serverAuth } from "@/features/auth"
import { eq } from "drizzle-orm"


export async function POST(req: Request){
   const userId = await serverAuth()
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }
   const body = await req.json() as (typeof StickyNotesTable.$inferInsert)
   const { title, priority, dueDate } = body
   if (!title || !priority) {
      return new Response('Title and priority are required', { status: 400 })
   }
   const allowedPriorities = ["LOW", "MEDIUM", "HIGH"] as const;
   const normalizedPriority = priority.toUpperCase();
   if (!allowedPriorities.includes(normalizedPriority as (typeof allowedPriorities)[number])) {
      return new Response('Priority must be LOW, MEDIUM, or HIGH', { status: 400 })
   }
   try {
      const newStickyNote = {
         title,
         priority: normalizedPriority as "LOW" | "MEDIUM" | "HIGH",
         dueDate: dueDate ? new Date(dueDate) : null,
         userId: userId as string
      }
      const db_res = await db.insert(StickyNotesTable).values(newStickyNote).returning()

      if (db_res.length === 0) {
         return new Response('Failed to add sticky note', { status: 500 })
      }

      return new Response("Sticky Note added successfully", { status: 201 })
   } catch (error) {
      console.error('Error adding sticky note:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   const userId = await serverAuth()
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }
   const body = await req.json() as { id: string }
   const { id } = body
   if (!id) {
      return new Response('Sticky note ID is required', { status: 400 })
   }
   try {
      const deletedNote = await db.delete(StickyNotesTable).where(eq(StickyNotesTable.id, id)).returning()
      if (deletedNote.length === 0) {
         return new Response('Sticky note not found', { status: 404 })
      }
      return new Response('Sticky note deleted successfully', { status: 200 })
   } catch (error) {
      console.error('Error deleting sticky note:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}