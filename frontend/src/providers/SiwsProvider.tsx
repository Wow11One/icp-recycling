import { useWallet } from '@solana/wallet-adapter-react';
import { SiwsIdentityProvider } from 'ic-siws-js/react';

export default function SiwsProvider({ children }: { children: React.ReactNode }) {
  // Listen for changes to the selected wallet
  const { wallet } = useWallet();

  // Update the SiwsIdentityProvider with the selected wallet adapter
  console.log('canisterId', 'canisterId')
  return (
    <SiwsIdentityProvider canisterId={'bw4dl-smaaa-aaaaa-qaacq-cai'} adapter={wallet?.adapter}>
      {children}
    </SiwsIdentityProvider>
  );
}
