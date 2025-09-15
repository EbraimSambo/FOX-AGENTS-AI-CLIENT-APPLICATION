"use client"
import React from 'react'

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [menuOpen, setMenuOpen] = React.useState(false)
    return (
        <div className={` bg-[#262626] transition-all`}>
            <main>
                {children}
            </main>
        </div>
    )
}

export default AppLayout