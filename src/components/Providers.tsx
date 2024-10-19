'use client'

import { type State, WagmiProvider } from 'wagmi'
import { config } from '../../config'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { base } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

const client = new QueryClient()


const Providers = ({ children, initialState }: { children: ReactNode; initialState?: State; }) => {
  
  const wallets = [
    
  ];

  return (
  <WagmiProvider config={config} initialState={initialState}>
    <QueryClientProvider client={client}>
      <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
          >
            {children}
      </OnchainKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
  )
}

export default Providers
