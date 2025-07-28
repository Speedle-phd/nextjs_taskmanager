import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/drizzle/db";
import { TeamTable, UserTeamTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

type Props = {
   id: string;
}
const TeamTasks = async ({id}:Props) => {

   let teams; 
   try {
      const db_res = await db.select().from(UserTeamTable).leftJoin(TeamTable, eq(UserTeamTable.teamId, TeamTable.id)).where(eq(UserTeamTable.userId, id))
      teams = db_res.map((userTeam) => userTeam.teams).filter((team): team is NonNullable<typeof team> => !!team);
   } catch (err){
      console.error('Error occuring. Please try again: ', err)
   }

  return (
    <Card className="p-4 w-[clamp(15rem,70vw,40rem)] mx-auto mt-8">
      <CardHeader>
         <h2 className="text-lg font-semibold">Your Teams</h2>
         <p className="text-sm text-muted-foreground">Select a team to view tasks</p>
      </CardHeader>
      <Separator className="my-2 bg-brand" />
      <CardContent className=" grid gap-2">
      {teams?.map((team: typeof TeamTable.$inferInsert) => {
         const {id, name} = team
         return (

               <Link key={id} href={`/tasks/team-tasks/${id}`} className="w-full">
               <Button variant="outline" className="w-full">
                  {name}
               </Button>
               </Link>

         )
      })}
      </CardContent>
    </Card>
  )
}

export default TeamTasks
