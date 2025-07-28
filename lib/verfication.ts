"use server"
import { db } from '@/drizzle/db'

export const getVerification = async (userId: string) => {
   try {
      const db_res = await db.query.UserTable.findFirst({
         where: (user, { eq }) => eq(user.id, userId),
         columns: {
            verified: true,
         },
      })
      return db_res?.verified || false
   } catch (error) {
      console.error('Error during verification:', error)
      return false
   }
}
