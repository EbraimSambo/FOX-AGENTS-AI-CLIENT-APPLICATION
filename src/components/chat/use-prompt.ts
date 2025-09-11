import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { suggestions } from "./data-suggestions"

const schema = z.object({
    prompt: z.string()
})

export const usePrompt = () => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    })
    const [selectedCategory, setSelectedCategory] = React.useState<typeof suggestions[0] | undefined>(undefined)

    const handleCategoryClick = (categoryName: string) => {
        form.setValue("prompt", categoryName, { shouldValidate: true })
        form.setFocus("prompt")
        const category = suggestions.find(cat => cat.category === categoryName)
        setSelectedCategory(category)
    }

    const handleSuggestionClick = (suggestion: string) => {
        form.setValue("prompt", suggestion, { shouldValidate: true })
        form.setFocus("prompt")
        setSelectedCategory(undefined)
        handleSend()
    }

    const handleTextareaChange = (value: string) => {
        form.setValue("prompt", value, { shouldValidate: true })

        if (!value.trim()) {
            setSelectedCategory(undefined)
        } else {
            const category = suggestions.find(cat => cat.category === value.trim())
            setSelectedCategory(category ?? undefined)
        }
    }

    const handleSend = () => {
        const value = form.getValues("prompt")
        if (value.trim()) {
            console.log("Enviando:", value)
            form.reset({ prompt: "" })
            setSelectedCategory(undefined)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return {
        form,
        handleKeyPress,
        handleTextareaChange,
        handleCategoryClick,
        handleSuggestionClick,
        handleSend,
        setSelectedCategory,
        selectedCategory
    }
}
