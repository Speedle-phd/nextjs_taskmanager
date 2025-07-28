import PersonalTaskStats from "../PersonalTaskStats"
import TeamTaskStats from "../TeamTaskStats"
import Underline from "../Underline"


const Home = () => {
  return (
   <div className="flex flex-col gap-4 items-center justify-center min-h-screen py-4 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4 text-brand text-center">Welcome to the Task Manager</h1>
      <p className="text-sm mb-8">Manage your tasks efficiently!</p>
      <div className="border rounded-lg p-4 bg-accent shadow-md w-[clamp(20rem,80vw,70rem)]">
         <header>
            <h2 className="font-bold text-lg text-center">Personal Tasks Stats Section</h2>
         </header>
         <Underline className="my-6 w-[25%]" />
         <PersonalTaskStats />
      </div>
      <div className="border rounded-lg p-4 bg-accent shadow-md w-[clamp(20rem,80vw,70rem)]">
         <header>
            <h2 className="font-bold text-lg text-center">Team Tasks Stats Section</h2>
         </header>
         <Underline className="my-6 w-[25%]" />
         <TeamTaskStats />
      </div>

   </div>
  )
}

export default Home