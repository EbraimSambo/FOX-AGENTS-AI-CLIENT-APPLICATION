import React from "react";
import { RemixiconComponentType } from "@remixicon/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suggestions } from "../data-suggestions";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  onClearCategory: () => void;
  onSuggestionHover?: (previewText: string) => void;
  onSuggestionLeave?: () => void;
}

const Suggestions = ({
  selectedCategory,
  textareaValue,
  onSuggestionClick,
  onCategoryClick,
  onClearCategory,
  onSuggestionHover,
  onSuggestionLeave,
}: Props) => {
  const handleSuggestionMouseEnter = (suggestion: string) => {
    if (selectedCategory && onSuggestionHover) {
      // Corrigindo a formatação do preview text
      const previewText = `${selectedCategory.category}: ${suggestion}`;
      console.log("Sending preview text:", previewText); // Debug
      onSuggestionHover(previewText);
    }
  };

  const handleSuggestionMouseLeave = () => {
    console.log("Mouse left suggestion"); // Debug
    if (onSuggestionLeave) {
      onSuggestionLeave();
    }
  };

  return (
    <div className="text-white px-8 hidden xl:block h-[340px]">
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
          <ScrollArea className="h-[340px] relative rounded-t-lg">
            <div className=" shadow rounded-lg p-2 bg-[#323130] pt-14">
              <div className="flex items-center justify-between p-2 px-4 pr-3 absolute top-0 right-0 left-0 w-full bg-[#323130] rounded-t-lg border-b border-muted-foreground">
                <div className="flex items-center gap-2">
                  {<selectedCategory.icon className="size-4" />}
                  <h2 className="text-sm">{selectedCategory.category}</h2>
                </div>
                <button
                  onClick={onClearCategory}
                  className="flex items-center justify-center h-8 w-8 hover:bg-muted-foreground/20 rounded-md transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              {selectedCategory.suggestions.map((suggestion, index) => (
                <div
                  className="p-3 cursor-pointer hover:bg-muted-foreground/20 rounded-md text-sm transition-colors duration-150 border border-transparent hover:border-muted-foreground/30"
                  key={index}
                  onClick={() => {
                    onSuggestionClick(suggestion);
                    if (onSuggestionLeave) onSuggestionLeave(); // limpa preview na hora do clique
                  }}
                  onMouseEnter={() => handleSuggestionMouseEnter(suggestion)}
                  onMouseLeave={handleSuggestionMouseLeave}
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