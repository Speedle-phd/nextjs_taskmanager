import { NextResponse } from "next/server"
import { sendMail } from "../../../../../../lib/email"

export async function POST(request: Request) {
   const { email, subject, html } = await request.json()
   if (!email || !subject || !html) {
      return NextResponse.json(
         { error: 'Missing required fields' },
         { status: 400 }
      )
   }
   // send email to user
   try {
      await sendMail(
         email,
         subject,
         html
      )
      return NextResponse.json(
         { message: 'Email sent successfully' }, {status: 200})
   } catch (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      )
   }
}