import { Input } from '../ui/input'
import { Label } from '../ui/label'

type Props = {
   label: string
   type: string
   name: string
   placeholder?: string
   ref?: React.Ref<HTMLInputElement>
}

const FormControl = (props: Props) => {
   const { label, type, placeholder, name, ref } = props
   return (
      <div className='grid'>
         <Label htmlFor={name} className='mb-1'>{label}</Label>
         <Input ref={ref} id={name} name={name} type={type} placeholder={placeholder} />
      </div>
   )
}

export default FormControl
