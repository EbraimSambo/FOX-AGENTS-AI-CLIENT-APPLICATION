"use client"
import React from 'react'
import { RiAttachmentLine, RiMic2Line, RiSendPlaneLine } from "@remixicon/react";
import SwitcherModel from './switcher-model';
import Suggestions from './suggestions';
import { suggestions } from './data-suggestions';

const PromptAi = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<typeof suggestions[0] | undefined>(undefined)
  const [textareaValue, setTextareaValue] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Função para lidar com clique em sugestão
  const handleSuggestionClick = (suggestion: string) => {
    setTextareaValue(suggestion)
    setSelectedCategory(undefined) // Esconde as sugestões
    textareaRef.current?.focus() // Foca no textarea
  }

  // Função para lidar com mudanças no textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTextareaValue(value)
    
    // Se o texto foi apagado, volta a mostrar as sugestões
    if (!value.trim()) {
      setSelectedCategory(undefined)
    }
  }

  // Função para enviar mensagem
  const handleSend = () => {
    if (textareaValue.trim()) {
      console.log('Enviando:', textareaValue)
      // Aqui você faria o envio da mensagem
      setTextareaValue('')
      setSelectedCategory(undefined)
    }
  }

  // Função para lidar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='space-y-4'>
      <div className="w-4xl shadow rounded-2xl p-4 space-y-2 bg-muted-foreground/15">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={textareaValue}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder='Alguma pergunta?'
            className='bg-transparent text-white placeholder-muted-foreground resize-none border-none outline-none w-full pr-12 min-h-[40px] max-h-[200px]'
            rows={1}
            style={{
              height: 'auto',
              minHeight: '40px'
            }}
          />
          
          {/* Botão de envio que aparece quando há texto */}
          {textareaValue.trim() && (
            <button
              onClick={handleSend}
              className='absolute right-2 top-2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-white rounded-md hover:bg-muted-foreground/20 transition-colors'
            >
              <RiSendPlaneLine className='size-5' />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between text-muted">
          <SwitcherModel />
          <div className="flex items-center">
            <button className='h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-white rounded-md hover:bg-muted-foreground/20 transition-colors'>
              <RiAttachmentLine className='size-6' />
            </button>
            <button className='h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-white rounded-md hover:bg-muted-foreground/20 transition-colors'>
              <RiMic2Line className='size-6' />
            </button>
          </div>
        </div>
      </div>
      
      <Suggestions 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        textareaValue={textareaValue}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  )
}

export default PromptAi