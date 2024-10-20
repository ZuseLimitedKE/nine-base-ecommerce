'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import NineSdk from 'nine-sdk'
import PaymentModal from '@/components/paymentModal'

const iPhoneDetails = {
  'iphone-x': { name: 'iPhone X', imgSrc: '/iphone x.png' },
  'iphone-11': { name: 'iPhone 11', imgSrc: '/iphone 11.png' },
  'iphone-12': { name: 'iPhone 12', imgSrc: '/iphone 12.png' },
  'iphone-13': { name: 'iPhone 13', imgSrc: '/iphone 13.png' },
  'iphone-14': { name: 'iPhone 14', imgSrc: '/iphone 14.png' },
  'iphone-15': { name: 'iPhone 15', imgSrc: '/iphone 15.png' },
};

const getWalletAddress = () => {
  const accounts = localStorage.getItem('-CBWSDK:SCWStateManager:accounts') ?? localStorage.getItem('-walletlink:https://www.walletlink.org:Addresses');
  if (accounts) {
    // Assuming the address you need is the first in the array
    if (typeof accounts === 'string') {
      return accounts;
    } else {
      const parsedAccounts = JSON.parse(accounts);
      return parsedAccounts[0];
    } 
  }
  return null;
};

const ThankYouPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast()
  
  const iPhone = iPhoneDetails[params.slug];
  
  const [accountAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve wallet address from localStorage
    const accountAddress = getWalletAddress();
    if (accountAddress) {
      setWalletAddress(accountAddress)
    }
  }, [])


  const handlePayment = async () => {
    if (accountAddress) {
      console.log('Wallet connected:', accountAddress);
    } else {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet before proceeding with the payment.',
        variant: 'destructive',
      })
      return
    }

    setPaymentStatus('pending')
    setIsPaymentModalOpen(true)

    try {
      // Initialize the SDK
      const sdk = new NineSdk({
        baseUrl: 'https://nine-base.onrender.com', 
        // baseUrl: 'https://8d20-197-232-251-154.ngrok-free.app'
        // baseUrl: 'https://smiling-lioness-grateful.ngrok-free.app'
      })

      // Create the payment request
      const paymentResponse = await sdk.createRequest({
        requestInfo: {
          expectedAmount: 10, // Amount in cents (e.g., $79.97)
          payeeAddress: process.env.NEXT_PUBLIC_PAYEE_ADDRESS, 
          payerAddress: accountAddress,
          timestamp: new Date().toISOString(),
        },
        contentData: {
          reason: 'Order Payment',
          dueDate: new Date().toISOString(),
        },
        signerAddress: accountAddress,
      })

      if (paymentResponse) {
        setPaymentStatus('success')
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your purchase! Your payment has been processed.',
          variant: 'default',
        })
        console.log("Payment feedback", paymentResponse)
        // Redirect to receipt page if needed
        router.push('/receipt')
      } else {
        setPaymentStatus('error')
        toast({
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setPaymentStatus('error')
      toast({
        title: 'Payment Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      })
    }
  }
  const truncateAddress = (address: string) => {
    return address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address
  }
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Thank you for your order!</h1>
      <p className='text-lg mb-6'>
        We’re processing your order. Please review your order details below and complete the payment.
      </p>

      <div className='bg-gray-50 p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-2xl font-semibold mb-4'>Order Summary</h2>
        <div className='flex justify-between mb-2'>
          <span className='font-medium'>Base price:</span>
          <span>$999.99</span>
        </div>
        <div className='flex justify-between mb-2'>
          <span className='font-medium'>Textured finish:</span>
          <span>$9.99</span>
        </div>
        <div className='flex justify-between mb-2'>
          <span className='font-medium'>Soft polycarbonate material:</span>
          <span>$19.99</span>
        </div>
        <div className='my-2 h-px bg-gray-200' />
        <div className='flex justify-between font-semibold'>
          <span>Order Total:</span>
          <span>$1029.97</span>
        </div>
      </div>

      {/* Display Wallet Address */}
      {accountAddress && (
        <div className='text-center mb-4'>
          <p className='text-lg font-medium'>Connected Wallet:</p>
          <p className='text-gray-700'>{truncateAddress(accountAddress)}</p>
        </div>
      )}

      <div className='flex justify-center'>
        <Button
          onClick={handlePayment}
          className='px-6 py-3 bg-green-600 text-white hover:bg-green-700'>
          {paymentStatus === 'pending' ? 'Processing...' : 'Send Payment Request'}
          <ArrowRight className='h-4 w-4 ml-2 inline' />
        </Button>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        accountAddress={accountAddress}
        paymentStatus={paymentStatus}
      />
      
    </div>
  )
}

export default ThankYouPage
