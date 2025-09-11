"use client"
import React from 'react'
import Sidebar from './partials/sidebar';

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [menuOpen, setMenuOpen] = React.useState(false)
    return (
        <div className={`bg-[#323130] h-screen w-full ${menuOpen && 'p-2'} flex transition-all`}>
           <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <main className='bg-[#262626] h-full w-full rounded-lg'>
                {children}
            </main>
        </div>
    )
}

export default AppLayout