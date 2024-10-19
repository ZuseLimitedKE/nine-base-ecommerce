import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import Image from 'next/image'
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getWalletAddress = () => {
    const accounts = localStorage.getItem('-CBWSDK:SCWStateManager:accounts');
    if (accounts) {
      const parsedAccounts = JSON.parse(accounts);
      return parsedAccounts[0]; // Assuming the address you need is the first in the array
    }
    return null;
  };
  
const PaymentModal = ({
  isOpen,
  setIsOpen,
  paymentStatus,
  accountAddress
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  paymentStatus: 'idle' | 'pending' | 'success' | 'error';
  accountAddress: string | null;
}) => {

    const [counter, setCounter] = useState(2);
    const router = useRouter();

  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      if (counter === 0) {
        clearInterval(timer);
        setIsOpen(false);
        // Redirect to the receipt page
        router.push('/receipt');
      }

      return () => clearInterval(timer);
    }
  }, [paymentStatus, counter]);
  
  useEffect(() => {
    const accountAddress = getWalletAddress();
    if (accountAddress) {
     console.log('BaseWallet connected for payment:', accountAddress)
    }
  }, []);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className='absolute z-[9999999]'>
        <DialogHeader>
          <div className='relative mx-auto w-24 h-24 mb-2'>
            <Image
              src='/snake-1.png'
              alt='snake image'
              className='object-contain'
              fill
            />
          </div>

          {paymentStatus === 'pending' && (
            <div className='text-center'>
              <DialogTitle className='text-2xl font-bold tracking-tight text-gray-900 mb-4'>
                We have sent a request to the wallet address:
              </DialogTitle>
              <div className='text-lg text-gray-700'>
                <p>{accountAddress}</p>
                <p className='mt-2'>Name:</p>
                <p>Amount:</p>
              </div>
              <p className='mt-4'>
                To complete this transaction, respond with either "Yes" or "No".
              </p>
              <div className='mt-4'>
                <Loader className='animate-spin mx-auto' size={40} color='green' />
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className='text-center'>
              <DialogTitle className='text-3xl font-bold tracking-tight text-gray-900 mb-4'>
                Payment made successfully!
              </DialogTitle>
              <div className='mt-4'>
                Redirecting in {counter} seconds...
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <DialogTitle className='text-3xl text-center font-bold tracking-tight text-gray-900'>
              Payment failed. Please try again.
            </DialogTitle>
          )}
          
          <DialogDescription className='text-base text-center py-2'>
            <span className='font-medium text-zinc-900'>
              Your configuration was saved!
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
