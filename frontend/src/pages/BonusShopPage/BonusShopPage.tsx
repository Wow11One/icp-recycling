import { useEffect, useState } from 'react';
import {
  Leaf,
  Gift,
  ShoppingBag,
  Coffee,
  Ticket,
  Award,
  AlertCircle,
} from 'lucide-react';
import { createActor as createDip20Actor, canisterId as dip20CanisterId } from 'declarations/dip20';
import { createActor as createNftActor, canisterId as nftCanisterId } from 'declarations/nft';
import toastNotifications from '../../utils/toastNotifications.utils';
import { useAuth } from '../../hooks/auth.hooks';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PorNft, IDL } from './por_nft';
import { mintNftWithPda } from './mint';
import { getFileUrl, uploadJsonToPinata } from '../../utils/pinata.utils';
import { useSiws } from 'ic-siws-js/react';

// Category icons mapping
const categoryIcons = {
  ['Shop']: <ShoppingBag className='h-5 w-5' />,
  ['Food/drinks']: <Coffee className='h-5 w-5' />,
  ['Present']: <Gift className='h-5 w-5' />,
  ['Environmental Impact']: <Leaf className='h-5 w-5' />,
  ['Experiences']: <Ticket className='h-5 w-5' />,
};

function BonusShopPage({ principal, authClient }) {
  const { identity: solanaIdentity } = useSiws();
  const { connection } = useConnection();
  const wallet = useWallet();
  //const { solanaIdentity } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [porBalance, setPorBalance] = useState(0);
  const [nftBonuses, setNftBonuses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const handleExchange = nft => {
    setSelectedNft(nft);
    setShowModal(true);
  };

  const confirmExchange = async () => {
    if (selectedNft && porBalance >= Number(selectedNft.token_cost)) {
      try {
        setPorBalance(prev => prev - Number(selectedNft.token_cost));
        const nfts = JSON.parse(localStorage.getItem('my-nfts') || '[]');
        console.log(selectedNft);
        nfts.push({
          ...selectedNft,
          token_cost: Number(selectedNft.token_cost),
          created_at: Number(selectedNft.created_at),
          id: Number(selectedNft.id),
        });
        localStorage.setItem('my-nfts', JSON.stringify(nfts));

        // solana logic
        if (solanaIdentity && wallet !== null) {
          console.log('salana', process.env.SOLANA_NFT_CONTRACT_ADDRESS);
          const provider = new AnchorProvider(connection, wallet, {});
          const program = new Program<PorNft>(
            IDL,
            //process.env.SOLANA_NFT_CONTRACT_ADDRESS!,
            '4jwVxfKwLtXhAkPxpWuiZMHB5deB4U7At6mkCrZUGonX',
            provider,
          );
          const uriIc = await uploadJsonToPinata({
            name: selectedNft.title,
            description: selectedNft.description,
            image: selectedNft.image,
            attributes: [
              { trait_type: 'active', value: false },
              { trait_type: 'createdAt', value: new Date().getTime() },
              { trait_type: 'category', value: selectedNft.category },
              { trait_type: 'tokenCost', value: Number(selectedNft.token_cost)  },
              { trait_type: 'discountSize', value: Number(selectedNft.discount_size) },
            ],
          });console.log('program after')
          
          await mintNftWithPda({ nftTitle: selectedNft.title, nftUri: getFileUrl(uriIc), connection, wallet, program });
          // icp logic
        } else {
          const identity = authClient.getIdentity();
          const dip20Actor = createDip20Actor(dip20CanisterId, {
            agentOptions: {
              identity,
            },
          });
          //await dip20Actor.burn(principal.getPrincipal().toString(), BigInt(Number(selectedNft.token_cost)));
        }

        toastNotifications.success(`Successfully exchanged PoR for "${selectedNft.title}" NFT!`);
        
       } catch (err: any) {
         console.error(err.message)
         toastNotifications.error(`Error occured while minting "${selectedNft.title}" NFT: ${err.message}!`);
       } finally {
        setShowModal(false);
       }
    }
  };

  const initData = async () => {
    setIsFetching(true);
    try {
      const identity = authClient.getIdentity();
      const dip20Actor = createDip20Actor(dip20CanisterId, {
        agentOptions: {
          identity: solanaIdentity || identity,
        },
      });
      const nftActor = createNftActor(nftCanisterId, {
        agentOptions: {
          identity: solanaIdentity || identity,
        },
      });

      const balance = await dip20Actor.balance_of(identity.getPrincipal().toString());
      setPorBalance(Number(balance));

      const nfts = await nftActor.get_template_nfts_helper();
      console.log(nfts);

      setNftBonuses(nfts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    initData().finally(() => setIsFetching(false));
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className='min-h-screen bg-green-50'>
      <main className='container mx-auto py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-green-800 mb-2'>Recycling Bonus Shop</h1>
              <p className='text-gray-600 max-w-2xl'>
                Exchange your recycling tokens for exclusive NFTs that can be used for discounts and
                special offers at participating stores.
              </p>
            </div>

            <div className='mt-4 md:mt-0 flex items-center gap-2 bg-white p-3 rounded-lg border border-green-200 shadow-sm'>
              <Award className='h-6 w-6 text-green-600' />
              <span className='font-medium text-gray-700'>Your PoR Balance:</span>
              <span className='text-xl font-bold text-green-600'>{porBalance} Tokens</span>
            </div>
          </div>

          <div className='mb-8'>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setSelectedCategory('Shop')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === 'Shop'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <ShoppingBag className='h-4 w-4' /> Shop
              </button>
              <button
                onClick={() => setSelectedCategory('Food/drinks')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === 'Food/drinks'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <Coffee className='h-4 w-4' /> Food/drinks
              </button>
              <button
                onClick={() => setSelectedCategory('Present')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === 'Present'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <Gift className='h-4 w-4' /> Present
              </button>
              <button
                onClick={() => setSelectedCategory('Environmental Impact')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === 'Environmental Impact'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <Leaf className='h-4 w-4' /> Environmental Impact
              </button>
              <button
                onClick={() => setSelectedCategory('Experiences')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === 'Experiences'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <Ticket className='h-4 w-4' /> Experiences
              </button>
            </div>
          </div>

          {isFetching && (
            <div className='h-full w-full flex justify-center items-center'>
              <div className='animate-spin size-10 border-4 my-18 border-green-500  border-t-transparent rounded-full' />
            </div>
          )}

          {!isFetching && (
            <>
              {/* NFT Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {nftBonuses
                  .filter(
                    bonus =>
                      selectedCategory === 'all' ||
                      bonus.category?.toLowerCase().includes(selectedCategory.toLowerCase()),
                  )
                  .map(nft => (
                    <div
                      key={nft.id}
                      className='bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow'
                    >
                      <div className='relative'>
                        <img
                          src={nft.image || '/placeholder.svg'}
                          alt={nft.title}
                          className='w-full h-48 object-cover'
                        />
                        <div className='absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-green-800 flex items-center gap-1 shadow-sm'>
                          {categoryIcons[nft.category]}
                          {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
                        </div>
                      </div>
                      <div className='p-4 flex flex-col justify-between'>
                        <h3 className='text-lg font-bold text-green-800 mb-2'>{nft.title}</h3>
                        <p className='text-gray-600 text-sm mb-4'>{nft.description}</p>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            <Award className='h-5 w-5 text-green-600' />
                            <span className='font-bold text-green-600'>
                              {Number(nft.token_cost)} Tokens
                            </span>
                          </div>
                          <button
                            onClick={() => handleExchange(nft)}
                            disabled={porBalance < Number(nft.token_cost)}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                              porBalance >= Number(nft.token_cost)
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {porBalance >= Number(nft.token_cost)
                              ? 'Exchange Tokens'
                              : 'Not Enough Tokens'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty state if no NFTs match filter */}
              {!nftBonuses.filter(
                bonus =>
                  selectedCategory === 'all' ||
                  bonus.category?.toLowerCase().includes(selectedCategory.toLowerCase()),
              ).length && (
                <div className='text-center py-12'>
                  <div className='flex justify-center mb-4'>
                    <AlertCircle className='h-12 w-12 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>No rewards found</h3>
                  <p className='text-gray-500'>
                    Try selecting a different category or check back later for new rewards.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && selectedNft && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-6'>
            <h3 className='text-xl font-bold text-green-800 mb-4'>Confirm Exchange</h3>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to exchange{' '}
              <span className='font-bold'>{Number(selectedNft.token_cost)} tokens</span> for "
              {selectedNft.title}" NFT?
            </p>

            <div className='bg-green-50 p-3 rounded-md mb-4 flex items-start gap-2'>
              <AlertCircle className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-green-700'>
                This action cannot be undone. The NFT will be minted to your connected wallet.
              </p>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={confirmExchange}
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
              >
                Confirm Exchange
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BonusShopPage;
