import React from "react";
import { suggestions } from "./data-suggestions";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { RemixiconComponentType } from "@remixicon/react";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";

interface Props {
  selectedCategory:
    | {
        category: string;
        icon: RemixiconComponentType;
        suggestions: string[];
      }
    | undefined;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<
      | {
          category: string;
          icon: RemixiconComponentType;
          suggestions: string[];
        }
      | undefined
    >
  >;
  textareaValue: string;
  onSuggestionClick: (suggestion: string) => void;
  onCategoryClick: (categoryName: string) => void;
  onClearCategory: () => void; // Nova prop para limpar categoria
}

const Suggestions = ({
  selectedCategory,
  textareaValue,
  onSuggestionClick,
  onCategoryClick,
  setSelectedCategory,
  onClearCategory, // Recebe a função de clear do componente pai
}: Props) => {
  if (
    textareaValue.trim() &&
    !suggestions.some((cat) => cat.category === textareaValue.trim())
  ) {
    return null;
  }

  return (
    <div className="text-white px-8 hidden xl:block">
      {!selectedCategory && (
        <div className="space-y-3">
          <div className="flex items-center flex-wrap ">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => onCategoryClick(suggestion.category)}
                className={`bg-transparent`}
              >
                <suggestion.icon className="size-5" />
                <span className="text-sm">{suggestion.category}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      {selectedCategory &&
        textareaValue.trim() === selectedCategory.category && (
          <ScrollArea className="h-[340px]">
            <div className=" shadow rounded-lg p-2 bg-[#323130]">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  {<selectedCategory.icon className="size-4" />}
                  <h2 className="text-sm">{selectedCategory.category}</h2>
                </div>
                <button 
                  onClick={onClearCategory} // Chama a função de clear
                  className="flex items-center justify-center h-8 w-8 hover:bg-muted-foreground/20 rounded-md transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <Separator className="bg-muted-foreground my-2 px-4" />
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
  );
};

export default Suggestions;