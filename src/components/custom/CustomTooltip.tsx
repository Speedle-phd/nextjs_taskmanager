

import {
   TooltipProvider,
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from '@/components/ui/tooltip'


type Props = {
   children: React.ReactNode
   message: string
}

const CustomTooltip = ({children, message}: Props) => {
  return (
     <TooltipProvider>
        <Tooltip>
           <TooltipTrigger asChild>
              {children}
           </TooltipTrigger>
           <TooltipContent side='left'>{message}</TooltipContent>
        </Tooltip>
     </TooltipProvider>
  )
}

export default CustomTooltip
