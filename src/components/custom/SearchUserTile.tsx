import { UserTable } from "@/drizzle/schema"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoader } from "@/app/context/LoadingContext"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

type Props = { 
   user: typeof UserTable.$inferSelect
   index?: number
   closeModal: () => void
   teamId: string
   inputElement: HTMLInputElement | null
}
const SearchUserTile = ({ user, index, closeModal, teamId, inputElement }: Props) => {
   const { fname, lname, email } = user
   const odd = index !== undefined && index % 2 !== 0 ? "" : ""
   const { showLoader, hideLoader } = useLoader()
   const router = useRouter()
   const handleClick = async () => {
      // Implement the logic to add the user to the team
      try {
         showLoader()
         closeModal()
         const response = await fetch('/api/v1/team/manage-user', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, teamId }),
         })
         if (!response.ok) {
            throw new Error('Failed to add user to team')
         }
         const data = await response.json()
         toast.success(data.message || 'User added to team successfully')
         if(inputElement){
            inputElement.value = ''
         }
         router.refresh()
      } catch (error) {
         console.error('Error adding user to team:', error)
         toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
      } finally {
         hideLoader()
      }
   }

   return (
      <div className={cn("bg-gray-200 p-2 relative", odd)}>
         <h2 className="text-sm md:text-lg font-bold">{`${fname} ${lname}`}</h2>
         <h3 className="text-[0.6rem] md:text-sm">{email}</h3>
         <Button onClick={handleClick} className="absolute right-1 top-1/2 -translate-y-1/2" variant="outline" size="sm"><Plus /></Button>
      </div>
   )
}

export default SearchUserTile
