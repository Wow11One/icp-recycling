import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Info } from 'lucide-react';
import { createActor, canisterId } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { ApplicationRoutes } from '../../utils/constants';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSiws } from 'ic-siws-js/react';
import { useAuth } from '../../hooks/auth.hooks';
import toastNotifications from '../../utils/toastNotifications.utils';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

function LoginPage({ setActor, isAuthenticated, setIsAuthenticated, setPrincipal }) {
  const { login: loginWithSolana, loginStatus, identity: solanaIdentity, clear } = useSiws();
  const { setSolanaIdentity } = useAuth();
  const wallet = useWallet();
  const [isConnectingIdentity, setIsConnectingIdentity] = useState(false);
  const [isConnectingSolanaWallet, setIsConnectingSolanaWallet] = useState(false);
  const formattedIdentity = solanaIdentity
    ? solanaIdentity.getPrincipal().toString().slice(0, 4) +
      '...' +
      solanaIdentity.getPrincipal().toString().slice(-4)
    : '';

  const [authClient, setAuthClient] = useState();
  const navigate = useNavigate();

  async function updateActor() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const isAuthenticated = await authClient.isAuthenticated();

    console.log('canisterId', canisterId);
    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(identity);
    console.log('identity ic', identity)
  }

  async function loginWithInternetIdentity() {
    setIsConnectingIdentity(true);
    await authClient.login({
      identityProvider,
      onSuccess: () => {
        updateActor().then(() => {
          navigate(ApplicationRoutes.Profile);
        });
        console.log('Login Successful!');
      },
    });
    setIsConnectingIdentity(false);
  }

  console.log('wallet', wallet)
  useEffect(() => {
    if (wallet) {
      //setState({ ...state, data: { ...state.data, walletId: wallet.publicKey.toBase58() } });
    } else {
      //setState({ ...state, data: { ...state.data, walletId: '' } });
    }
  }, [wallet]);

  useEffect(() => {
    updateActor();
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className='min-h-screen bg-green-50 p-4 py-10 w-full'>
      {/* Main Content */}
      <main className='flex-1 flex items-center justify-center w-full'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='p-8'>
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4'>
                <LogIn className='h-8 w-8 text-green-600' />
              </div>
              <h1 className='text-2xl font-bold text-green-800'>Welcome to PoR</h1>
              <p className='text-gray-600 mt-2'>
                Sign in with Internet Identity to access your account
              </p>
            </div>

            {/* <button
              onClick={login}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center mb-5 gap-2 py-3 px-4 rounded-md font-medium text-white transition-colors ${isConnecting ? "bg-green-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
                }`}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <img src='/icp-logo.png' className='w-5 h-5' />
                  Connect Internet Identity
                </>
              )}
            </button> */}

            <button
              onClick={loginWithInternetIdentity}
              disabled={isConnectingIdentity}
              className={`mb-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium secondary-button ${
                isConnectingIdentity ? 'cursor-not-allowed' : ''
              }`}
            >
              {isConnectingIdentity ? (
                <>
                  <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                  Connecting...
                </>
              ) : (
                <>
                  <img src='/icp-logo.png' className='w-5 h-5' />
                  Login with Internet Identity
                </>
              )}
            </button>
            <div className='mt-6 bg-green-50 rounded-md p-4 text-sm'>
              <div className='flex items-start gap-3'>
                <Info className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-medium text-green-800 mb-1'>About Internet Identity</h3>
                  <p className='text-gray-600'>
                    Internet Identity is a blockchain authentication system that allows you to sign
                    in without usernames, passwords, or providing personal information. It's secure,
                    anonymous, and built on the Internet Computer Protocol.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center justify-center gap-2 text-sm text-gray-500'>
              <Lock className='h-4 w-4' />
              <span>Your data remains private and secure</span>
            </div>
          </div>

          <div className='px-8 py-4 bg-gray-50 border-t border-gray-100'>
            <p className='text-center text-sm text-gray-600'>
              Don't have an Internet Identity yet?{' '}
              <a
                href='https://identity.ic0.app/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-green-600 hover:text-green-700 font-medium'
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
