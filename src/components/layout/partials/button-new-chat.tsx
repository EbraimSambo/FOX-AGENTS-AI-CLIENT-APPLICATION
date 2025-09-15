import { generateUUID } from '@/helpers/generate-uuid'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoCreateOutline } from 'react-icons/io5'

const ButtonNewChat = () => {
    const router = useRouter()

    const handleClick = () => {
      const uuid = generateUUID()
      router.push(`/chats/${uuid}`)
    }
    return (
        <button onClick={handleClick} className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted-foreground/25">
            <IoCreateOutline className="size-7 text-white" />
        </button>
    )
}

export default ButtonNewChat