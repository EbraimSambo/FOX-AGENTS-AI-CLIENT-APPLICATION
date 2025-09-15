'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Bolt, CircleUser } from 'lucide-react'
import React from 'react'
import { GiDreadSkull } from 'react-icons/gi'
import { useSession } from 'next-auth/react'
import { getFirstAndLastName } from '@/helpers/name'

const UserMenu = () => {
  const { data: session } = useSession()


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='outline-none'>
          <Avatar className='h-[40px] w-[40px]'>
            <AvatarImage src={session?.user?.image as string} alt="@shadcn" />
            <AvatarFallback>
              {session?.user && getFirstAndLastName(session.user.name as string)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='translate-y-1 w-[220px] bg-[#262626] border-muted-foreground text-white' align="end" sideOffset={5}>
          <div className="space-y-2 pb-2">
            <DropdownMenuItem className='cursor-pointer' disabled>
              <CircleUser className='text-white' />
              <span className='ml-1 text-xs text-white'>
                {getFirstAndLastName(session?.user?.name as string)}
              </span>
            </DropdownMenuItem>
            <div className='cursor-pointer flex items-center gap-2 px-2'>
              <span className='flex items-center gap-1'>
                <Bolt className=' size-4 text-white' />
                <span className='ml-2 text-xs text-white '>Configurações</span>
              </span>
            </div>

            <div className='cursor-pointer flex items-center gap-2 px-2'>
              <GiDreadSkull className='text-white' />
              <span className='text-xs text-white'>Atualizar Plano</span>
            </div>
          </div>
          {/* <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)} className='cursor-pointer'>
            <span className='flex items-center gap-1'>
              <LogOut className='text-black dark:text-white size-5' />
              <span className='text-xs'>Sair</span>
            </span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>


      {/* <DialogLogout open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} /> */}
    </>
  )
}

export default UserMenu
