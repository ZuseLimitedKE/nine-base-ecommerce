import type { Metadata } from 'next'
import { Recursive } from 'next/font/google'
import './globals.css'
import '@coinbase/onchainkit/styles.css';
import { headers } from 'next/headers';
import { type ReactNode } from 'react';
import { cookieToInitialState } from 'wagmi';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
import { constructMetadata } from '@/lib/utils'

import { config } from '../../config';

const recursive = Recursive({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    config,
    headers().get('cookie')
  );
  return (
    <html lang='en'>
      <body className={recursive.className}>

        <Providers initialState={initialState}>
          <Navbar />
          <main className='flex grainy-dark flex-col min-h-[calc(100vh-3.5rem-1px)]'>
            <div className='flex-1 flex flex-col h-full'>
              {children}
            </div>
            <Footer />
          </main>
          <Toaster />
        </Providers>
        
      </body>
    </html>
  )
}
