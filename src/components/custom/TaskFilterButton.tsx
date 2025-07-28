import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import CustomTooltip from './CustomTooltip'



type Props = {
   children: React.ReactNode
   setFilter: (e: React.MouseEvent) => void
   message: string
   dataFilterArray: [string, string, string]
}

const TaskFilterButton = ({children, dataFilterArray, message, setFilter}: Props) => {
   const [filterOne, filterTwo, filterThree] = dataFilterArray
   return (
      <DropdownMenu>
         <CustomTooltip message={message}>
            <DropdownMenuTrigger asChild>
               <Button variant='outline' size='sm'>
                  {children}
               </Button>
            </DropdownMenuTrigger>
         </CustomTooltip>
         <DropdownMenuContent>
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-filter={filterOne} onClick={setFilter}>
               Pending
            </DropdownMenuItem>
            <DropdownMenuItem data-filter={filterTwo} onClick={setFilter}>
               In progress
            </DropdownMenuItem>
            <DropdownMenuItem data-filter={filterThree} onClick={setFilter}>
               Completed
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default TaskFilterButton
