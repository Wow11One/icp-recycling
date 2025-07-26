import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  Clock,
  CheckCircle,
  Filter,
  Search,
  ExternalLink,
  Copy,
  ShoppingBag,
  Coffee,
  Gift,
  Leaf,
  Ticket,
  Award,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor as createNftActor, canisterId as nftCanisterId } from 'declarations/nft';
import toastNotifications from '../../utils/toastNotifications.utils';
import { Navigate, useNavigate } from 'react-router-dom';
import { ApplicationRoutes } from '../../utils/constants';
import { Realtime } from "ably";

const categoryIcons = {
  ['Shop']: <ShoppingBag className='h-5 w-5' />,
  ['Food/drinks']: <Coffee className='h-5 w-5' />,
  ['Present']: <Gift className='h-5 w-5' />,
  ['Environmental Impact']: <Leaf className='h-5 w-5' />,
  ['Experiences']: <Ticket className='h-5 w-5' />,
};

const ably = new Realtime({ key: "b_2_wA.WNGPXw:iksvvgxXbSaB4VDl1S3ZkL0r7TGz3GjdoAG6d5eZkGA" });

function MyNftsPage() {
  // const myNfts = JSON.parse(localStorage.getItem('my-nfts') || '[]');
  // console.log(myNfts);
  const [filter, setFilter] = useState('all'); // all, unused, used
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNft, setSelectedNft] = useState(null);
  const [showQrCode, setShowQrCode] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [identity, setIdentity] = useState();
  const [myNfts, setMyNfts] = useState([]);
  const navigate = useNavigate();

  const filteredNfts = myNfts.filter(nft => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'used') {
      return !!nft.ownership.used_at?.length;
    }
    if (filter === 'unused') {
      return !nft.ownership.used_at?.length;
    }
  });

  const handleNftSelect = nft => {
    setSelectedNft({ ...nft });
    setShowQrCode(true);
    setCopiedCode(false);
  };

  const handleCopyCode = code => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const formatDate = dateString => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      + ' '
      + date.toLocaleTimeString('en-GB');
  };

  const handleUseNft = (nftId, usedAt) => {
    setMyNfts((prevNfts) => ([
      ...prevNfts.map((nftWrapper: any) => (nftWrapper.nft.id === nftId)
        ? { ...nftWrapper, ownership: { ...nftWrapper.ownership, used_at: usedAt } }
        : nftWrapper
      )
    ]) as any);

    const currentNft = myNfts.filter(nft => nft.nft.id === nftId);
    currentNft.ownership.used_at = usedAt;
    console.log('currentNft', currentNft)
    setSelectedNft((prev) => ({
      ...currentNft
    }));
  };

  const initData = async () => {
    try {
      setIsFetching(true);
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const nftActor = createNftActor(nftCanisterId, {
        agentOptions: {
          identity: identity,
        },
      });

      const usersNfts = await nftActor.get_user_nfts(identity.getPrincipal().toString());
      console.log('usersNfts', usersNfts)
      setMyNfts([...usersNfts]);
      setIdentity(identity);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    initData().finally(() => setIsFetching(false));
    window.scrollTo({ top: 0 });

    const channel = ably.channels.get("qr-scan");

    channel.subscribe("scan", (msg) => {
      console.log('msgg', msg)
      //setMessages((prev) => [...prev, msg.data]);
      toastNotifications.success(`Your NFT was successfully scanned!`);
      handleUseNft(msg.data.nftIdParam, msg.data.usageTime)
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className='min-h-screen bg-green-50'>
      {/* Main Content */}
      <main className='container mx-auto py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold text-green-800 mb-2'>My NFT Collection</h1>
          <p className='text-gray-600 max-w-2xl mb-8'>
            View and manage your recycling reward NFTs. Use them to get discounts and special offers
            at participating stores.
          </p>

          {isFetching && (
            <div className='h-full w-full flex justify-center items-center'>
              <div className='animate-spin size-10 border-4 my-18 border-green-500  border-t-transparent rounded-full' />
            </div>
          )}

          {!isFetching && <>
            <div className='bg-white p-4 rounded-lg border border-green-200 shadow-sm mb-6'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-auto'>
                <div className='flex items-center gap-2'>
                  <Filter className='h-5 w-5 text-green-600' />
                  <span className='font-medium text-green-800'>Filter:</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${filter === 'all'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('unused')}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${filter === 'unused'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                    >
                      <CheckCircle className='h-3.5 w-3.5' /> Available
                    </button>
                    <button
                      onClick={() => setFilter('used')}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${filter === 'used'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                    >
                      <Clock className='h-3.5 w-3.5' /> Used
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div
                className={`${selectedNft ? 'hidden lg:block' : ''} lg:col-span-${selectedNft ? '1' : '3'}`}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
                  {filteredNfts.map(nftWrapper => (
                    <div
                      key={nftWrapper.nft.id}
                      onClick={() => handleNftSelect(nftWrapper)}
                      className={`bg-white rounded-lg overflow-hidden border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedNft && selectedNft.id === nftWrapper.nft.id ? 'ring-2 ring-green-600' : ''
                        }`}
                    >
                      <div className='relative'>
                        <img
                          src={nftWrapper.nft.image || '/placeholder.svg'}
                          alt={nftWrapper.nft.title}
                          className='w-full h-40 object-cover'
                        />
                        <div className='absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm'>
                          {categoryIcons[nftWrapper.nft.category]}
                          {nftWrapper.nft.category.charAt(0).toUpperCase() + nftWrapper.nft.category.slice(1)}
                        </div>
                        <div
                          className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${!nftWrapper.ownership.used_at?.length
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {!nftWrapper.ownership.used_at?.length ? (
                            <CheckCircle className='h-3.5 w-3.5' />
                          ) : (
                            <Clock className='h-3.5 w-3.5' />
                          )}
                          {!nftWrapper.ownership.used_at?.length ? 'Available' : 'Used'}
                        </div>
                      </div>
                      <div className='p-4'>
                        <h3 className='text-lg font-bold text-green-800 mb-1'>{nftWrapper.nft.title}</h3>
                        <p className='text-xs text-gray-500 mb-2'>
                          Acquired: {formatDate(new Date(Number(nftWrapper.ownership.minted_at)))}
                        </p>
                        <p className='text-sm text-gray-600 line-clamp-2'>{nftWrapper.nft.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredNfts.length === 0 && (
                  <div className='text-center py-12 bg-white rounded-lg border border-green-200'>
                    <Award className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                    <h3 className='text-lg font-medium text-gray-700 mb-2'>No NFTs found</h3>
                    <p className='text-gray-500 max-w-md mx-auto'>
                      {filter !== 'all'
                        ? `You don't have any ${filter} NFTs matching your search.`
                        : "You don't have any NFTs matching your search."}
                    </p>
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className='mt-4 text-green-600 hover:text-green-700 font-medium'
                      >
                        View all NFTs
                      </button>
                    )}
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className='mt-4 text-green-600 hover:text-green-700 font-medium block mx-auto'
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!selectedNft && (
                <div className='w-full flex justify-center items-center lg:col-span-2 rounded-lg border-2 border-dashed border-green-200 text-green-600 opacity-80 min-h-60'>
                  <div className='text-xl font-medium text-center '>Select token from your collection...</div>
                </div>
              )}

              {selectedNft && (
                <div className='lg:col-span-2'>
                  <div className='bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden'>
                    {/* Mobile back button */}
                    <div className='lg:hidden p-4 border-b border-gray-100'>
                      <button
                        onClick={() => setSelectedNft(null)}
                        className='flex items-center gap-1 text-sm font-medium text-green-600'
                      >
                        <ArrowLeft className='h-4 w-4' />
                        Back to NFTs
                      </button>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6'>
                      <div className='p-6'>
                        <div className='relative mb-4'>
                          <img
                            src={selectedNft.nft.image || '/placeholder.svg'}
                            alt={selectedNft.nft.title}
                            className='w-full h-64 object-cover rounded-lg'
                          />
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${!selectedNft.ownership.used_at?.length
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {!selectedNft.ownership.used_at?.length ? (
                              <CheckCircle className='h-3.5 w-3.5' />
                            ) : (
                              <Clock className='h-3.5 w-3.5' />
                            )}
                            {!selectedNft.ownership.used_at?.length ? 'Available' : 'Used'}
                          </div>
                        </div>

                        <div className='flex items-center gap-2 mb-2'>
                          {categoryIcons[selectedNft.nft.category]}
                          <span className='text-sm font-medium text-gray-600'>
                            {selectedNft.nft.category.charAt(0).toUpperCase() +
                              selectedNft.nft.category.slice(1)}
                          </span>
                        </div>

                        <h2 className='text-2xl font-bold text-green-800 mb-2'>
                          {selectedNft.nft.title}
                        </h2>
                        <p className='text-gray-600 mb-4'>{selectedNft.nft.description}</p>

                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>Acquired:</span>
                            <span className='font-medium'>
                              {formatDate(new Date(Number(selectedNft.ownership.minted_at)))}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>Expires:</span>
                            <span className='font-medium'>{formatDate(selectedNft.nft.expiryDate)}</span>
                          </div>
                          {!!selectedNft.ownership.used_at?.length && (
                            <div className='flex justify-between'>
                              <span className='text-gray-500'>Used on:</span>
                              <span className='font-medium'>{formatDate(new Date(Number(selectedNft.ownership.used_at)))}</span>
                            </div>
                          )}
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>Token Cost:</span>
                            <span className='font-medium'>{Number(selectedNft.nft.token_cost)} Tokens</span>
                          </div>
                        </div>
                      </div>

                      <div className='p-6 bg-gray-50 flex flex-col'>
                        <h3 className='text-lg font-bold text-green-800 mb-4'>Redemption Details</h3>


                        <div className='bg-white p-4 rounded-lg border border-gray-200 mb-4'>
                          {showQrCode ? (
                            <div className='text-center'>
                              {!selectedNft.ownership.used_at?.length ? <>
                                <div className='bg-white p-4 inline-block rounded-lg border border-gray-200 mb-2'>
                                  <div className='w-48 h-48 mx-auto flex items-center justify-center'>
                                    <QRCodeSVG value={`${window.location.origin}${ApplicationRoutes.ScanPage}?currentOwner=${identity?.getPrincipal().toString()}&nftId=${selectedNft.nft.id}`} className='h-full w-full text-gray-400' />
                                  </div>
                                </div>
                                <p className='text-sm text-gray-600'>
                                  Show this QR code to the cashier to redeem your reward
                                </p>
                              </> :
                                <>
                                  <div className='bg-white p-4 inline-block rounded-lg border border-gray-200 mb-2'>
                                    <div className='w-48 h-48 mx-auto flex items-center justify-center'>
                                      <QrCode className='h-24 w-24 text-gray-400' />
                                    </div>
                                  </div>
                                  <p className='text-sm text-gray-600'>
                                    The discount was already used
                                  </p>
                                </>
                              }
                            </div>
                          ) : (
                            <div>
                              <p className='text-sm text-gray-600 mb-2'>Redemption Code:</p>
                              <div className='flex items-center gap-2 mb-4'>
                                <div className='bg-gray-100 py-2 px-3 rounded font-mono text-sm flex-grow'>
                                  {selectedNft.id}
                                </div>
                                <button
                                  onClick={() => handleCopyCode(selectedNft.redemptionCode)}
                                  className='p-2 text-gray-500 hover:text-green-600 rounded-md hover:bg-gray-100'
                                  title='Copy code'
                                >
                                  <Copy className='h-5 w-5' />
                                </button>
                              </div>
                              {copiedCode && (
                                <p className='text-green-600 text-sm mb-2'>
                                  Code copied to clipboard!
                                </p>
                              )}
                              <button
                                onClick={() => setShowQrCode(true)}
                                className='text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1'
                              >
                                <QrCode className='h-4 w-4' />
                                Show as QR code
                              </button>
                            </div>
                          )}
                        </div>

                        <div className='space-y-4'>
                          {/* <button
                              onClick={handleUseNft}
                              className='w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors'
                            >
                              Mark as Used
                            </button> */}

                          {/* <div className='text-center'>
                              <a
                                href='#'
                                className='text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 justify-center'
                              >
                                View on blockchain
                                <ExternalLink className='h-3.5 w-3.5' />
                              </a>
                            </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>}
        </div>
      </main>
    </div>
  );
}

export default MyNftsPage;
