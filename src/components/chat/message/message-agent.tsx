import { Content } from '@/core/chat'
import React from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeMessage from './code-message'
import Image from 'next/image'
import ActonsMessageModel from './actons-message-model'
const MessageAgent = ({ message }: { message: Content }) => {
  const components: Components = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')

      return !inline && match ? (
        <CodeMessage
        >
          {children}
        </CodeMessage>
      ) : (
        <CodeMessage>
          {children}
        </CodeMessage>
      )
    },

    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      )
    },

    img({ src, alt }) {
      return (
        <Image
          src={src as string || ""}
          alt={alt as string || 'Sem descricao'}
          fill
          className="max-w-full h-auto rounded-md my-4"
        />
      )
    },

    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-4">
          {children}
        </blockquote>
      )
    },

    h1: ({ children }) => (
      <h1 className="text-2xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium my-2">{children}</h3>
    ),
    ul: ({ children }) => <ul className="pl-6 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="pl-6 list-disc">{children}</ol>,
    li: ({ children }) => <li className="">{children}</li>,
    p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
    table: ({ children }) => (
      <table className="table-auto border-collapse border  my-4 w-full text-sm rounded-xs">
        {children}
      </table>
    ),
    thead: ({ children }) => (
      <thead className="">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-t border-gray-300">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 px-3 py-2 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-3 py-2">{children}</td>
    ),
  }
  return (
    <div>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {message.content}
      </Markdown>
      <ActonsMessageModel content={message} />
    </div>
  )
}

export default MessageAgent