import { NextResponse } from 'next/server'

import bcrypt from 'bcrypt'
import { createJwtToken } from '../../../../../../lib/session'
import { sendMail } from '../../../../../../lib/email'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'



export async function POST(request: Request) {
   try {
      // Extract necessary fields from the request body
      const { email, password, confirmPassword } = await request.json()

      if (!confirmPassword || !email || !password) {
         return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
         )
      }

      const hashedPassword = await bcrypt.hash(password, 10)


      const [newUser] = await db.insert(UserTable).values({deprecated: false, email, password: hashedPassword}).returning().onConflictDoUpdate({
         target: UserTable.email,
         set: {deprecated: false, password: hashedPassword},
      })


      //create session
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      await createJwtToken(newUser.id, secret)
      // send email to user to verify their account
      const { id, email: userEmail } = newUser
      const html = `
      <div>
         <h1>Welcome to Task Manager</h1>
         <p>Click the link below to verify your account:</p>
         <a href="${process.env.BASE_URL}/api/v1/auth/verify?id=${id}">Verify Account</a>
      `
      await sendMail(
         userEmail!,
         'Verify your account',
         html
      )
      

      return NextResponse.json(
         { message: 'User signed up successfully' },
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
