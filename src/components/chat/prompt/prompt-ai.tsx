"use client";
import React, { useState } from "react";
import {
  RemixiconComponentType,
  RiAttachmentLine,
  RiSendPlaneLine,
} from "@remixicon/react";
import SwitcherModel from "../switcher-model";
import { Controller, UseFormReturn } from "react-hook-form";
import { FaStop } from "react-icons/fa6";
import Suggestions from "./suggestions";
import GreetUser from "@/components/user/greet-user";
import ShowFilesSelected from "./show-files";

interface Props {
  showSuggestions: boolean;
  handleCategoryClick: (categoryName: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleTextareaChange: (value: string) => void;
  handleSend: () => void;
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
  form: UseFormReturn<{
    prompt?: string | undefined;
    model?: string | undefined;
    files?: File[] | undefined;
  }, any, {
    prompt?: string | undefined;
    model?: string | undefined;
    files?: File[] | undefined;
  }>;
  selectedCategory:
  | {
    category: string;
    icon: RemixiconComponentType;
    suggestions: string[];
  }
  | undefined;
  isPending: boolean;
  stopRequest: () => void;
}

const PromptAi = ({
  selectedCategory,
  showSuggestions,
  form,
  isPending,
  handleCategoryClick,
  handleKeyPress,
  handleSend,
  handleSuggestionClick,
  handleTextareaChange,
  stopRequest,
  setSelectedCategory,
}: Props) => {
  const promptValue = form.watch("prompt") || "";
  const hasText = promptValue.trim().length > 0;
  const watchedFiles = form.watch('files');
  const [previewText, setPreviewText] = useState<string>("");
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  // Botão desabilitado quando não há texto E não está em execução
  // Verifica se há texto ou arquivos
  const hasFiles = watchedFiles && watchedFiles.length > 0;
  const isButtonDisabled = !hasText && !hasFiles && !isPending;

  // Função para limpar categoria e textarea se necessário
  const handleClearCategory = () => {
    if (selectedCategory && promptValue.trim() === selectedCategory.category) {
      // Se o textarea contém exatamente o nome da categoria, limpa o textarea
      form.setValue("prompt", "");
      handleTextareaChange("");
    }
    // Remove a categoria selecionada
    setSelectedCategory(undefined);
    // Limpa o preview também
    setPreviewText("");
    setIsHovering(false);
  };

  const handleSuggestionHover = (text: string) => {
    setPreviewText(text);
    setIsHovering(true);
  };

  const handleSendWithClear = () => {
    // Primeiro limpa o preview para forçar o displayValue a usar field.value
    setPreviewText("");
    setIsHovering(false);

    // Chama a função original de envio
    handleSend();

    // Limpa o formulário e o textarea após enviar
    form.setValue("prompt", "");
    handleTextareaChange("");

    // Remove categoria selecionada
    setSelectedCategory(undefined);
  };

  const handleSuggestionLeave = () => {
    setPreviewText("");
    setIsHovering(false);
  };


  return (
    <div className=" fixed bottom-0 right-0 left-0 bg-[#262626] px-8 xl:px-0">
      <div className="space-y-8 max-w-4xl w-full mx-auto pb-10 xl:pb-15">
        {showSuggestions && <GreetUser />}
        <div className="relative w-full shadow rounded-2xl p-4 space-y-2 bg-muted-foreground/15">
          <ShowFilesSelected form={form} fileInputRef={fileInputRef} />
          <div className="w-full">
            <Controller
              name="prompt"
              control={form.control}
              defaultValue=""
              render={({ field }) => {
                const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

                const adjustHeight = () => {
                  if (textareaRef.current) {
                    // Reset height to auto to get the correct scrollHeight
                    textareaRef.current.style.height = "auto";

                    // Get the scroll height
                    const scrollHeight = textareaRef.current.scrollHeight;

                    // Set minimum height (equivalent to 1 row)
                    const minHeight = 40;

                    // Set maximum height (equivalent to ~6-7 rows)
                    const maxHeight = 160;

                    // Calculate the new height
                    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

                    // Apply the new height
                    textareaRef.current.style.height = `${newHeight}px`;
                  }
                };

                // Adjust height when component mounts or field value changes
                React.useEffect(() => {
                  adjustHeight();
                }, [field.value]);

                // Valor a ser mostrado no textarea
                // Força a usar field.value se estivermos limpando (field.value vazio)
                const displayValue = (isHovering && previewText && field.value !== "")
                  ? previewText
                  : field.value;

                return (
                  <textarea
                    ref={textareaRef}
                    value={displayValue}
                    onChange={(e) => {
                      // Só atualiza o formulário se não estiver mostrando preview
                      if (!isHovering || !previewText) {
                        field.onChange(e);
                        handleTextareaChange(e.target.value);
                        setTimeout(() => {
                          adjustHeight();
                        }, 0);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Alguma pergunta?"
                    disabled={isPending}
                    className={`bg-transparent text-white placeholder-muted-foreground resize-none border-none outline-none w-full pr-12 min-h-[40px] max-h-[160px] overflow-y-auto ${isHovering && previewText ? 'text-muted-foreground italic' : ''
                      }`}
                    rows={1}
                    style={{ height: '40px' }}
                  />
                );
              }}
            />
          </div>

          <div className="relative flex items-center justify-between text-muted">
            <SwitcherModel form={form} />
            <div className="flex items-center gap-1 pr-2">
              <button
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8  md:w-10 md:h-10 flex items-center justify-center text-white rounded-md hover:bg-muted-foreground/20 transition-colors"
              >
                <RiAttachmentLine className="size-4 md:size-6" />
              </button>
              <button
                onClick={() => {
                  if (isPending) {
                    stopRequest();
                  } else {
                    handleSendWithClear();
                  }
                }}
                disabled={isButtonDisabled}
                className={`h-8 w-8  md:w-10 md:h-10 flex items-center justify-center text-white rounded-md transition-colors ${isPending
                  ? "bg-muted-foreground/20 animate-pulse hover:bg-muted-foreground/30"
                  : isButtonDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted-foreground/20"
                  }`}
              >
                {!isPending && <RiSendPlaneLine className="size-4 md:size-6" />}
                {isPending && <FaStop className="size-4 md:size-6" />}
              </button>
            </div>
          </div>
        </div>
        {showSuggestions && (
          <Suggestions
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            textareaValue={promptValue}
            onSuggestionClick={handleSuggestionClick}
            onCategoryClick={handleCategoryClick}
            onClearCategory={handleClearCategory}
            onSuggestionHover={handleSuggestionHover}
            onSuggestionLeave={handleSuggestionLeave}
          />
        )}
      </div>
    </div>
  );
};

export default PromptAi;