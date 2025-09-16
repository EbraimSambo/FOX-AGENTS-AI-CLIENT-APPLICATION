"use client";
import React from "react";
import {
  RemixiconComponentType,
  RiAttachmentLine,
  RiMic2Line,
  RiSendPlaneLine,
} from "@remixicon/react";
import SwitcherModel from "./switcher-model";
import Suggestions from "./suggestions";
import { Controller, UseFormReturn } from "react-hook-form";
import { FaStop } from "react-icons/fa6";
import { Content, Message } from "@/core/chat";
import { AxiosError, AxiosResponse } from "axios";
import { UseMutationResult } from "@tanstack/react-query";
import GreetUser from "./greet-user";
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
  mutation: UseMutationResult<
    AxiosResponse<
      {
        title: string;
        messages: Array<Message>;
      },
      any,
      {}
    >,
    AxiosError<unknown, any>,
    {
      prompt: string;
    },
    unknown
  >;
  form: UseFormReturn<
    {
      prompt: string;
    },
    any,
    {
      prompt: string;
    }
  >;
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
  return (
    <div className=" fixed bottom-0 right-0 left-0 bg-[#262626] px-8 xl:px-0">
      <div className="space-y-8 max-w-4xl w-full mx-auto pb-30">
        {showSuggestions && <GreetUser />}
        <div className="relative w-full shadow rounded-2xl p-4 space-y-2 bg-muted-foreground/15">
          <div className="w-full">
            <Controller
              name="prompt"
              control={form.control}
              defaultValue=""
              render={({ field }) => (
                <textarea
                  {...field}
                  onChange={(e) => handleTextareaChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Alguma pergunta?"
                  disabled={isPending}
                  className="bg-transparent text-white placeholder-muted-foreground resize-none border-none outline-none w-full pr-12 min-h-[40px] max-h-[200px]"
                  rows={1}
                  style={{
                    height: "auto",
                    minHeight: "40px",
                  }}
                />
              )}
            />
          </div>

          <div className="relative flex items-center justify-between text-muted">
            <SwitcherModel />
            <div className="flex items-center">
              <button
                disabled={isPending}
                className="h-10 w-10 flex items-center justify-center text-white rounded-md hover:bg-muted-foreground/20 transition-colors"
              >
                <RiAttachmentLine className="size-6" />
              </button>
              <button
                onClick={() => {
                  if (isPending) {
                    stopRequest();
                  } else {
                    handleSend();
                  }
                }}
                className={`h-10 w-10 flex items-center justify-center text-white rounded-md  ${isPending && "bg-muted-foreground/20 animate-pulse"} hover:bg-muted-foreground/20 transition-colors`}
              >
                {!isPending && <RiSendPlaneLine className="size-5" />}
                {isPending && <FaStop className="size-6" />}
              </button>
            </div>
          </div>
        </div>
        {showSuggestions && (
          <Suggestions
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            textareaValue={form.watch("prompt") || ""}
            onSuggestionClick={handleSuggestionClick}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </div>
    </div>
  );
};

export default PromptAi;
