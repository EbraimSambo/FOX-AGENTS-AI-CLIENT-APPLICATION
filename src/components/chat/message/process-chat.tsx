import React from 'react'

const ProcessChat = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="inline-flex gap-1">
                <span className="bg-muted-foreground inline-block h-3 w-3 animate-bounce rounded-full [animation-delay:-0.2s]" />
                <span className="bg-muted-foreground inline-block h-3 w-3 animate-bounce rounded-full [animation-delay:-0.1s]" />
                <span className="bg-muted-foreground inline-block h-3 w-3 animate-bounce rounded-full " />
            </div>
        </div>
    )
}

export default ProcessChat