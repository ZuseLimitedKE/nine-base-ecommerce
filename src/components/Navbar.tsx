"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ClipboardCopy, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { WalletComponent } from './Wallet'

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedAddress = localStorage.getItem('walletAddress')
    const storedPublicKey = localStorage.getItem('publicKey')
    if (storedAddress && storedPublicKey) {
      setWalletAddress(storedAddress)
      setPublicKey(storedPublicKey)
    }
  }, [])

  const handleWalletConnected = (address: string, publicKey: string) => {
    console.log('Wallet connected:', { address, publicKey })
    setWalletAddress(address)
    setPublicKey(publicKey)
  }

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex text-2xl z-4 font-semibold'>
            <Image
            src={"/snake-3.png"}
            alt='snake'
            width={32}
            height={32}
            className='mr-2'
            />
            Nine<span className='text-green-600'>Commerce</span>
          </Link>

          <div className='h-full flex items-center space-x-4'>
            <WalletComponent />
            <Link
              href='/'
              className={buttonVariants({
                size: 'lg',
                className: 'hidden text-base sm:flex items-center gap-1',
              })}
            >
              Purchase a customized iPhone today!
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
