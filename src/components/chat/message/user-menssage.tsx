import { Content } from '@/core/chat';
import { RiFileCopyLine } from '@remixicon/react'
import { RotateCw } from 'lucide-react'
import React from 'react'

interface Props {
  message: Content;
  onRetry: () => void;
}

const UserMenssage = ({ message, onRetry }: Props) => {
  return (
    <div className="text-end group">
      <div className="flex justify-end">
        <p className="text-sm font-bold text-white p-2 px-4 max-w-full rounded-xl bg-muted-foreground/20 shadow-md break-words overflow-hidden">
          {message.content}
        </p>
      </div>
      <div className="flex justify-end px-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => navigator.clipboard.writeText(message.content)}
          className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
        >
          <RiFileCopyLine className="size-4" />
        </button>
        {message.error?.trim() && (
          <button
            onClick={onRetry}
            className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
          >
            <RotateCw className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default UserMenssage
