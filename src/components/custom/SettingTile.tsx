
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card"

import React from "react"
import { Separator } from "../ui/separator";
type Props = {
   icon: React.ReactNode;
   content: string;
   link: string

}
const SettingTile = ({icon, content, link} : Props) => {
  return (
    <Link href={link}>
       <Card className="group border-2 border-brand shadow-brand shadow-md hover:shadow-lg transition-all duration-300 ease-in-out w-[225px] font-bold text-brand">
         <CardHeader className="flex items-center justify-between">
            {icon}
         </CardHeader>
         <Separator />
         <CardContent className="text-center">
            {content}
         </CardContent>
       </Card>
    </Link>
  )
}

export default SettingTile
