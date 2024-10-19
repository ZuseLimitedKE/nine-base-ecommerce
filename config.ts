import { ReactNode } from 'react'
import { http, cookieStorage, createStorage, createConfig, WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [ baseSepolia ],
  connectors: [
    coinbaseWallet({
      appName: 'onchainkit',
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
    interface Register {
      config: typeof config
    }
  }
  