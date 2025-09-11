"use client"
import React from 'react'
import { RiAttachmentLine, RiMic2Line, RiSendPlaneLine } from "@remixicon/react";
import SwitcherModel from './switcher-model';
import Suggestions from './suggestions';
import { usePrompt } from './use-prompt';
import { Controller } from "react-hook-form";

const PromptAi = () => {
    const { 
        form,
        handleCategoryClick,
        handleKeyPress,
        handleSuggestionClick,
        handleTextareaChange,
        handleSend,
        setSelectedCategory,
        selectedCategory 
    } = usePrompt()

    return (
        <div className='space-y-4'>
            <div className="w-4xl shadow rounded-2xl p-4 space-y-2 bg-muted-foreground/15">
                <div className="relative">
                    <Controller
                        name="prompt"
                        control={form.control}
                        defaultValue=""
                        render={({ field }) => (
                            <textarea
                                {...field}
                                onChange={(e) => handleTextareaChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Alguma pergunta?'
                                className='bg-transparent text-white placeholder-muted-foreground resize-none border-none outline-none w-full pr-12 min-h-[40px] max-h-[200px]'
                                rows={1}
                                style={{
                                    height: 'auto',
                                    minHeight: '40px'
                                }}
                            />
                        )}
                    />
                </div>

                <div className="flex items-center justify-between text-muted">
                    <SwitcherModel />
                    <div className="flex items-center">
                        <button className='h-10 w-10 flex items-center justify-center text-white rounded-md hover:bg-muted-foreground/20 transition-colors'>
                            <RiAttachmentLine className='size-6' />
                        </button>
                        {form.watch("prompt")?.trim() ? (
                            <button
                                onClick={handleSend}
                                className='h-8 w-8 flex items-center justify-center text-white rounded-md hover:bg-muted-foreground/20 transition-colors'
                            >
                                <RiSendPlaneLine className='size-5' />
                            </button>
                        ) : (
                            <button className='h-10 w-10 flex items-center justify-center text-white rounded-md hover:bg-muted-foreground/20 transition-colors'>
                                <RiMic2Line className='size-6' />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Suggestions
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                textareaValue={form.watch("prompt") || ""}
                onSuggestionClick={handleSuggestionClick}
                onCategoryClick={handleCategoryClick}
            />
        </div>
    )
}

export default PromptAi
