import { useWallet } from '@solana/wallet-adapter-react';
import { SiwsIdentityProvider } from 'ic-siws-js/react';

export default function SiwsProvider({ children }: { children: React.ReactNode }) {
  // Listen for changes to the selected wallet
  const { wallet } = useWallet();

  // Update the SiwsIdentityProvider with the selected wallet adapter
  return (
    <SiwsIdentityProvider canisterId={'by6od-j4aaa-aaaaa-qaadq-cai'} adapter={wallet?.adapter}>
      {children}
    </SiwsIdentityProvider>
  );
}
