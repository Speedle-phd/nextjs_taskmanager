import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { createJwtToken } from '../../../../../../lib/session'
import { db } from '@/drizzle/db'


export async function POST(request: Request) {
   try {
      // Extract necessary fields from the request body
      const { email, password } = await request.json()



      if (!email || !password) {
         return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
         )
      }



      const db_res = await db.query.UserTable.findFirst({
         where: (user, { eq }) => eq(user.email, email),
         columns: {
            id: true,
            email: true,
            password: true,
            deprecated: true,
         },
      })
      
      if (db_res?.deprecated) {
         return NextResponse.json(
            { error: 'User account is deprecated' },
            { status: 403 }
         )
      }

      if (!db_res){
         return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
         )
      }

      const comparedPassword = bcrypt.compare(password, db_res.password!)


      if (!comparedPassword) {
         return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
         )
      }

      //create session
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      await createJwtToken(db_res.id, secret)
      

      return NextResponse.json(
         { message: 'Logged in successfully' },
         { status: 201 }
      )
   } catch (error) {
      console.error('Error during signup:', error)
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      )
   }
}
