import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { sendMail } from "../../../../../../lib/email";

import bcrypt from "bcrypt";

export async function PATCH(req: Request){
   const{ email } = await req.json();
   const newPassword = crypto.randomUUID()
   const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password before storing it


   try {

      if (!email ) {
         return new Response(JSON.stringify({ error: 'Email is required.' }), {
            status: 400,
            headers: {
               'Content-Type': 'application/json',
            },
         });
      }


      const db_res = await db.update(UserTable).set({password: hashedPassword}).where(eq(UserTable.email, email)).returning()


      if (!db_res) {
         return new Response(JSON.stringify({ error: 'Email not found.' }), {
            status: 404,
            headers: {
               'Content-Type': 'application/json',
            },
         });
      }


      
      const html = `
         <h1>Password Reset</h1>
         <p>Your new password is: <strong>${newPassword}</strong></p>
         <p>Please log in with this password and change it immediately.</p>
         <p>Thank you for using Task Manager!</p>
         <p>Best regards,</p>
         <p>Task Manager Team</p>
      `
      await sendMail(email, 'Task Manager Password Reset', html)
      return new Response(JSON.stringify({ message: 'Password reset email sent successfully.' }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   } catch (error) {
      console.error('Error sending password reset email:', error);
      return new Response(JSON.stringify({ error: 'Failed to send password reset email.' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }
}