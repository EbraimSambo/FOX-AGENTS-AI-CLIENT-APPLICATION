import Image from 'next/image'
import React from 'react'

const LoaderApp = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
        <Image src={"/logo.png"} alt='' width={40} height={40} className='animate-pulse' />
    </div>
  )
}

export default LoaderApp