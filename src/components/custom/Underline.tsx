import { cn } from "@/lib/utils"

type Props = {
   color?: string
   className?: string
}

const Underline = ({color, className} : Props) => {
   return (
      <div
         className={
            cn(
               'w-[50%] h-1 rounded-full my-4 mx-auto bg-amber-800 dark:bg-amber-300', color, className)
         }
      ></div>
   )
}
export default Underline
