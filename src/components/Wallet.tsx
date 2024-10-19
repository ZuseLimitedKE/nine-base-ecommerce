import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename, 
    WalletDropdownFundLink, 
    WalletDropdownLink, 
    WalletDropdownDisconnect,
  } from '@coinbase/onchainkit/wallet';
  import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance, 
  } from '@coinbase/onchainkit/identity';
   
  import { color } from '@coinbase/onchainkit/theme';
   
  export const WalletComponent = () => {
    return (
  <Wallet>
    <ConnectWallet className="bg-blue-700">
      <Avatar className="h-6 w-6" />
      <Name />
    </ConnectWallet>
    <WalletDropdown className='hover:bg-blue-200'>
      <Identity 
        className="px-4 pt-3 pb-2 hover:bg-blue-200" 
        hasCopyAddressOnClick
      >
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>
      <WalletDropdownBasename className='hover:bg-blue-200' />
      <WalletDropdownLink
        className='hover:bg-blue-200'
        icon="wallet"
        href="https://keys.coinbase.com"
      >
        Wallet
      </WalletDropdownLink>
      <WalletDropdownFundLink className='hover:bg-blue-200' />
      <WalletDropdownDisconnect className='hover:bg-blue-200' />
    </WalletDropdown>
  </Wallet>
    );
}