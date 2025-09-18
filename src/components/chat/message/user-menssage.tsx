import { Content } from '@/core/chat';
import { RiPencilLine } from '@remixicon/react';
import { Check, Copy, RotateCw } from 'lucide-react'
import Image from 'next/image';
import React from 'react'

interface Props {
  message: Content;
  onRetry: () => void;
}

const UserMenssage = ({ message, onRetry }: Props) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content as string);
      setCopied(true);

      // depois de 2s volta ao normal
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar: ", err);
    }
  };
  return (
    <div className="text-end group">
      <div className="flex justify-end">
        <p className="text-sm font-bold text-white p-2 px-4 max-w-full rounded-xl bg-muted-foreground/20 shadow-md break-words overflow-hidden">
          {message.content}
        </p>
      </div>
      <div className="flex items-center justify-end w-full gap-4 flex-wrap mt-2">
        {message.attachments.map((image) => (
          <div className="relative w-20 h-20 cursor-pointer" key={image.url}>
            <Image
              alt={image.url}
              src={image.url}
              className='rounded-2xl object-cover'
              fill
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end px-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleCopy}
          className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        {message.error?.trim() ? (
          <button
            onClick={onRetry}
            className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
          >
            <RotateCw className="size-4" />
          </button>
        ) : (
          <button
            className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
          >
            <RiPencilLine className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default UserMenssage
