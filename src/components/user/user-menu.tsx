'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Bolt, CircleUser, LogOut } from 'lucide-react'
import React from 'react'
import { GiDreadSkull } from 'react-icons/gi'
import { useSession } from 'next-auth/react'
import { getFirstAndLastName } from '@/helpers/name'
import DialogLogout from '../auth/dialog-logout'

const UserMenu = () => {
  const { data: session } = useSession()
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className='outline-none'>
          <Avatar className='h-[40px] w-[40px]'>
            <AvatarImage src={session?.user?.image as string} alt="@shadcn" />
            <AvatarFallback>
              {session?.user && getFirstAndLastName(session.user.name as string)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='translate-y-1 z-50 w-[220px] bg-[#262626] border-muted-foreground text-white' align="end" sideOffset={5}>
          <DropdownMenuItem className='cursor-pointer' disabled>
            <CircleUser className='text-white' />
            <span className='ml-1 text-xs text-white'>
              {getFirstAndLastName(session?.user?.name as string)}
            </span>
          </DropdownMenuItem>
          <div className="space-y-3 pb-2 mt-2">
            <div className='cursor-pointer flex items-center gap-2 px-2 hover:text-muted-foreground text-white'>
              <span className='flex items-center gap-1'>
                <Bolt className=' size-4' />
                <span className='ml-2 text-xs '>Configurações</span>
              </span>
            </div>

            <div className='cursor-pointer flex items-center gap-2 px-2 hover:text-muted-foreground text-white'>
              <GiDreadSkull className='' />
              <span className='text-xs '>Atualizar Plano</span>
            </div>
            <div onClick={() => {
              setLogoutDialogOpen(true)
              setOpen(false)
            }} className='cursor-pointer flex items-center gap-2 px-2 hover:text-muted-foreground text-white'>
              <span className='flex items-center gap-1'>
                <LogOut className='size-5' />
                <span className='text-xs'> Terminar sessao</span>
              </span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>


      <DialogLogout open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />
    </>
  )
}

export default UserMenu
