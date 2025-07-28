import { Button } from "@/components/ui/button"
import Link from "next/link"

const TeamPage = () => {
   return (
      <div className="auto-grid gap-4">
         <Link className="w-full" href='/teams/manage'>
            <Button variant="secondary" className="w-full font-bold text-lg h-auto py-4">Manage your Teams</Button>
         </Link>
         <Link className="w-full" href='/teams/create'>
            <Button variant="secondary" className="w-full font-bold text-lg h-auto py-4">Create a new Team</Button>
         </Link>
      </div>
   )
}

export default TeamPage
