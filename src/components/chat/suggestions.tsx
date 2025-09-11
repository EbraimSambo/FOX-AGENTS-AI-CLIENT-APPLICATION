import React from 'react'
import { suggestions } from './data-suggestions'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { RemixiconComponentType } from '@remixicon/react'
import { RiArrowLeftLine } from '@remixicon/react'

interface Props {
    selectedCategory: {
        category: string;
        icon: RemixiconComponentType;
        suggestions: string[];
    } | undefined,
    setSelectedCategory: React.Dispatch<React.SetStateAction<{
        category: string;
        icon: RemixiconComponentType;
        suggestions: string[];
    } | undefined>>,
    textareaValue: string,
    onSuggestionClick: (suggestion: string) => void
}

const Suggestions = ({ selectedCategory, setSelectedCategory, textareaValue, onSuggestionClick }: Props) => {
    // Se o textarea tem conteúdo, não mostra sugestões
    if (textareaValue.trim()) {
        return null;
    }

    return (
        <div className='text-white px-8'>
            {!selectedCategory && (
                <div className="space-y-3">
                    <div className="flex items-center flex-wrap gap-1">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                onClick={() => setSelectedCategory(suggestion)}
                                className='bg-transparent'
                            >
                                <suggestion.icon className='size-5' />
                                <span className="text-sm">{suggestion.category}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {selectedCategory && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedCategory(undefined)}
                            className="text-muted-foreground hover:text-white h-8 w-8 flex items-center justify-center"
                        >
                            <RiArrowLeftLine className="size-4 mr-1" />
                        </button>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <selectedCategory.icon className="size-5" />
                            <h3 className="text-md font-medium">{selectedCategory.category}</h3>
                        </div>
                    </div>

                    <ScrollArea className="h-[300px]">
                        <div className="bg-muted-foreground/15 shadow rounded-lg p-4">
                            {selectedCategory.suggestions.map((suggestion, index) => (
                                <div
                                    className="p-3 cursor-pointer hover:bg-muted-foreground/20 rounded-md text-sm transition-colors duration-150 border border-transparent hover:border-muted-foreground/30"
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}

export default Suggestions