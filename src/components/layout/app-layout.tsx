import React from 'react'

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='bg-[#262626]'>
            {children}
        </div>
    )
}

export default AppLayout