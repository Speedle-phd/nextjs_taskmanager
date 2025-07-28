import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request){
   //get the jwt from the params
   const { searchParams } = new URL(request.url)
   const id = searchParams.get('id')
   if (!id) {
      return NextResponse.json(
         { error: 'Missing required fields' },
         { status: 400 }
      )
   }
   //verify the user

   const db_res = await db.update(UserTable).set({verified: true}).where(eq(UserTable.id, id)).returning()


   if (!db_res) {
      return NextResponse.json(
         { error: 'User not found' },
         { status: 404 }
      )
   }
   return redirect(`${process.env.BASE_URL}/`)

}