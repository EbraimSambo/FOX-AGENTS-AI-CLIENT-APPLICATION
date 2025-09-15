"use client"
import React from 'react'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  
  // Create a client
  const queryClient = new QueryClient()
const Providers = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
  )
}

export default Providers