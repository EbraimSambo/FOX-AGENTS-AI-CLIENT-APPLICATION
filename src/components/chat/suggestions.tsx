import React from 'react'
import { suggestions } from './data-suggestions'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { RemixiconComponentType } from '@remixicon/react'

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
  onSuggestionClick: (suggestion: string) => void,
  onCategoryClick: (categoryName: string) => void
}

const Suggestions = ({ 
  selectedCategory, 
  textareaValue, 
  onSuggestionClick,
  onCategoryClick 
}: Props) => {
  
  if (textareaValue.trim() && !suggestions.some(cat => cat.category === textareaValue.trim())) {
    return null;
  }

  return (
    <div className='text-white px-8'>
     {!selectedCategory && <div className="space-y-3">
        <div className="flex items-center flex-wrap ">
          {suggestions.map((suggestion, index) => (
            <Button 
              key={index}
              onClick={() => onCategoryClick(suggestion.category)}
              className={`bg-transparent`}
            >
              <suggestion.icon className='size-5' />
              <span className="text-sm">{suggestion.category}</span>
            </Button>
          ))}
        </div>
      </div>}

      {selectedCategory && textareaValue.trim() === selectedCategory.category && (
          <ScrollArea className="h-[340px]">
            <div className=" shadow rounded-lg p-2 bg-[#323130]">
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
      )}
    </div>
  )
}

export default Suggestions