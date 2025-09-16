import { Content } from '@/core/chat'
import { RiThumbDownLine, RiThumbUpLine } from '@remixicon/react';
import { Check, Copy, MoreHorizontal, RotateCw } from 'lucide-react';
import React from 'react'

const ActonsMessageModel = ({content}:{content: Content}) => {
      const [copied, setCopied] = React.useState(false);
    
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(content.content);
          setCopied(true);
    
          // depois de 2s volta ao normal
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Erro ao copiar: ", err);
        }
      };
  return (
    <div className="flex space-x-1 transition-opacity duration-200">
    <button
      onClick={handleCopy}
      className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
    >
        {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
    <button
      className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
    >
      <RotateCw className="size-4" />
    </button>
    <button
      className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
    >
      <RiThumbUpLine className="size-5" />
    </button>
    <button
      className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
    >
      <RiThumbDownLine className="size-5" />
    </button>
    <button
      className="h-8 w-8 flex items-center justify-center text-white hover:text-gray-300"
    >
      <MoreHorizontal className="size-5" />
    </button>
  </div>
  )
}

export default ActonsMessageModel