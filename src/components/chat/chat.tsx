"use client"
import { Content } from '@/core/chat';
import React from 'react'
import PromptAi from './prompt-ai';
import ContentChat from './Content-Chat';
import { usePrompt } from '@/hooks/use-prompt';
import { userGetMessagesByChatUUID } from '@/hooks/get-chat';
import LoaderChat from './loader-chat';

interface Props {
    chatUUID: string
}

const Chat = ({ chatUUID }: Props) => {
    const query = userGetMessagesByChatUUID(chatUUID)
    const [messages, setMessages] = React.useState<Content[]>([]);

    React.useEffect(() => {
        if (query.data?.pages) {
            const allMessages = query.data.pages.flatMap(page => page.items.map((t) => ({
                ...t,
                error: null,
                pending: false,
                isWriting: false
            })) || []);
            setMessages(allMessages);
        }
    }, [query.data]);

    const {
        form,
        handleCategoryClick,
        handleKeyPress,
        handleSuggestionClick,
        handleTextareaChange,
        handleSend,
        setSelectedCategory,
        selectedCategory,
        mutation,
        isPending,
        handleRetry,
        stopRequest,
        forceDone,
        setForceDone,
        handleTypewriterComplete // Adicione esta nova função
    } = usePrompt({
        chatUUID,
        setMessages,
        messages,
    })

    if (query.isLoading) return <LoaderChat />

    return (
        <div className="max-w-3xl w-full mx-auto pt-12 4 pb-40 ">
            <ContentChat 
                setForceDone={setForceDone} 
                forceDone={forceDone} 
                stopRequest={stopRequest} 
                handleRetry={handleRetry} 
                messages={messages}
                handleTypewriterComplete={handleTypewriterComplete} // Passe a função para ContentChat
            />
            <PromptAi
                stopRequest={stopRequest}
                isPending={isPending}
                showSuggestions={messages?.length == 0}
                form={form}
                handleCategoryClick={handleCategoryClick}
                handleKeyPress={handleKeyPress}
                handleSend={handleSend}
                handleSuggestionClick={handleSuggestionClick}
                handleTextareaChange={handleTextareaChange}
                mutation={mutation}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
        </div>
    )
}

export default Chat