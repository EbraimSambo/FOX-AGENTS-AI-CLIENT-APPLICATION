'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { ProgressCircle } from '../ui/progress'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogLogout: React.FC<Props> = ({ open, onOpenChange }) => {
    const [isPending, setIsPneding] = React.useState(false)
    const logout = async () => {
        setIsPneding(true)
        try {
            await signOut()
        } catch {
            setIsPneding(false)
        }

    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='w-full sm:max-w-[434px] [&>button]:hidden outline-none bg-[#262626] text-white border-none'>
                <DialogHeader className='text-center'>
                    <DialogTitle className='text-center text-2xl'>Deseja sair da sua conta?</DialogTitle>
                    <DialogDescription className='text-center text-lg mt-2'>
                        Esta ação encerrará sua sessão.
                    </DialogDescription>
                    <div className="space-y-3 mt-4">
                        <Button onClick={logout} disabled={isPending} className='rounded-full w-full bg-[#262626] border-muted-foreground border h-10 font-bold'>
                            {isPending && (
                                 <ProgressCircle value={15} size={15} strokeWidth={2} className="text-white animate-spin" />
                            )}
                            {!isPending && (
                                "Sair"
                            )}
                        </Button>
                        <Button onClick={()=>onOpenChange(false)} disabled={isPending} variant={"outline"} className='rounded-full w-full h-10 text-black font-bold'>
                            Cancelar
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DialogLogout
