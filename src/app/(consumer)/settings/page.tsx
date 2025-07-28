import SettingTile from '@/components/custom/SettingTile'
import { EyeOff, Lock, MonitorX, User } from 'lucide-react'
import React from 'react'

const Settings = async() => {
   


  return (
   <div className="auto-grid gap-2 place-items-center p-4">
      
      <SettingTile icon={<Lock className="mx-auto group-hover:scale-150 transition-all" />}  content={"Change your Password"} link={"settings/change-password"}/>
      <SettingTile icon={<User className="mx-auto group-hover:scale-150 transition-all" />} content={"Change your user info"} link={"settings/change-user-info"}/>
      <SettingTile icon={<MonitorX className="mx-auto group-hover:scale-150 transition-all" />}  content={"Delete your account"} link={"settings/delete-account"}/>
      <SettingTile icon={<EyeOff className="mx-auto group-hover:scale-150 transition-all" />} content={"Change Visibility"} link={"settings/change-visibility"}/>

   </div>
  )
}

export default Settings