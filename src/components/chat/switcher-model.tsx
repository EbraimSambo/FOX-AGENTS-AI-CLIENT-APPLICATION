import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { models } from './models'
import { RiArrowDownSLine } from '@remixicon/react'
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";

const SwitcherModel = () => {
  const [model, setModel] = React.useState(models[0])
  const [open, setOpen] = React.useState(false)
  const handleModel = (model: typeof models[0]) => {
    setModel(model)
    setOpen(false)
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className='outline-none'>
        <button
          className='flex items-center gap-2 hover:bg-muted-foreground/25 p-2 rounded-lg' >
          {<model.icon className='size-6' />}
          <span>{model.name}</span>
          <RiArrowDownSLine className='size-5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-78 p-1 bg-[#262626] border-none text-white translate-x-32 -translate-y-[120%] ">
        <DropdownMenuRadioGroup >
          {models.map((modelLOcal, index) => (
            <DropdownMenuRadioItem
              className='p-2 flex items-center gap-2 cursor-pointer hover:bg-muted-foreground/15 relative'
              onClick={() => handleModel(modelLOcal)} key={index} value="email" onSelect={(event) => event.preventDefault()}>
              <modelLOcal.icon className='size-6' />
              <div className="">
                <span className='font-semibold'>{modelLOcal.name}</span>
                <p className="text-xs">{modelLOcal.description}</p>
              </div>
              <div className="h-full flex items-center justify-center absolute top-0 right-0 pr-2">
                {model.type == modelLOcal.type && <MdOutlineRadioButtonChecked className="size-5" />}
                {model.type != modelLOcal.type && <MdOutlineRadioButtonUnchecked className="size-5" />}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SwitcherModel