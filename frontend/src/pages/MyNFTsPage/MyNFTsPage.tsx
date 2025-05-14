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

const myNfts = [
  {
    id: 'nft-001',
    title: '10% Off at EcoStore',
    description: 'Get 10% off your next purchase at EcoStore. Valid for 30 days after minting.',
    image:
      'https://www.office-coffee.co.uk/assets/media/301r-how-to-be-a-sustainable-coffee-drinker-1024x600.webp',
    acquiredDate: '2023-10-15',
    expiryDate: '2023-11-15',
    status: 'unused',
    category: 'discount',
    redemptionCode: 'ECO-10OFF-XYZ123',
    tokenCost: 50,
  },
  {
    id: 'nft-002',
    title: 'Free Coffee at GreenBean',
    description: 'Enjoy a free coffee of your choice at any GreenBean location. No expiration.',
    image:
      'https://www.office-coffee.co.uk/assets/media/301r-how-to-be-a-sustainable-coffee-drinker-1024x600.webp',
    acquiredDate: '2023-09-22',
    expiryDate: null,
    status: 'used',
    usedDate: '2023-10-05',
    category: 'freebie',
    redemptionCode: 'COFFEE-FREE-ABC456',
    tokenCost: 75,
  },
  {
    id: 'nft-003',
    title: 'Eco-Friendly Tote Bag',
    description: 'Redeem for a limited edition recycled material tote bag. While supplies last.',
    image:
      'https://www.office-coffee.co.uk/assets/media/301r-how-to-be-a-sustainable-coffee-drinker-1024x600.webp',
    acquiredDate: '2023-11-01',
    expiryDate: null,
    status: 'unused',
    category: 'merchandise',
    redemptionCode: 'TOTE-ECO-DEF789',
    tokenCost: 100,
  },
  {
    id: 'nft-004',
    title: 'Plant a Tree Certificate',
    description:
      "We'll plant a tree in your name and send you a digital certificate with GPS coordinates.",
    image:
      'https://www.office-coffee.co.uk/assets/media/301r-how-to-be-a-sustainable-coffee-drinker-1024x600.webp',
    acquiredDate: '2023-08-10',
    expiryDate: null,
    status: 'used',
    usedDate: '2023-08-15',
    category: 'impact',
    redemptionCode: 'TREE-PLANT-GHI012',
    tokenCost: 150,
  },
  {
    id: 'nft-005',
    title: '25% Off Recycled Products',
    description: 'Get 25% off any product made from recycled materials at participating stores.',
    image:
      'https://www.office-coffee.co.uk/assets/media/301r-how-to-be-a-sustainable-coffee-drinker-1024x600.webp',
    acquiredDate: '2023-10-30',
    expiryDate: '2023-12-30',
    status: 'unused',
    category: 'discount',
    redemptionCode: 'RECYCLE-25OFF-JKL345',
    tokenCost: 125,
  },
];

const categoryIcons = {
  discount: <ShoppingBag className='h-5 w-5' />,
  freebie: <Coffee className='h-5 w-5' />,
  merchandise: <Gift className='h-5 w-5' />,
  impact: <Leaf className='h-5 w-5' />,
  experience: <Ticket className='h-5 w-5' />,
};

function MyNftsPage() {
  const myNfts = JSON.parse(localStorage.getItem('my-nfts') || '[]');
  console.log(myNfts);
  const [filter, setFilter] = useState('all'); // all, unused, used
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNft, setSelectedNft] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter NFTs based on status and search query
  const filteredNfts = myNfts.filter(nft => {
    const matchesFilter = filter === 'all' || nft.status === filter;
    const matchesSearch =
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle NFT selection for detailed view
  const handleNftSelect = nft => {
    setSelectedNft(nft);
    setShowQrCode(false);
    setCopiedCode(false);
  };

  // Handle copy redemption code
  const handleCopyCode = code => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle NFT usage
  const handleUseNft = () => {
    // In a real app, this would call an API to mark the NFT as used
    const updatedNfts = myNfts.map(nft =>
      nft.id === selectedNft.id
        ? { ...nft, status: 'used', usedDate: new Date().toISOString().split('T')[0] }
        : nft,
    );

    // Update the selected NFT
    const updatedSelectedNft = {
      ...selectedNft,
      status: 'used',
      usedDate: new Date().toISOString().split('T')[0],
    };

    setSelectedNft(updatedSelectedNft);

    // Show confirmation message
    alert(`You've successfully used your "${selectedNft.title}" NFT!`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
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

          {/* Filters and Search */}
          <div className='bg-white p-4 rounded-lg border border-green-200 shadow-sm mb-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <Filter className='h-5 w-5 text-green-600' />
                <span className='font-medium text-green-800'>Filter:</span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'all'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unused')}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      filter === 'unused'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle className='h-3.5 w-3.5' /> Available
                  </button>
                  <button
                    onClick={() => setFilter('used')}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      filter === 'used'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <Clock className='h-3.5 w-3.5' /> Used
                  </button>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-4 w-4 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search your NFTs...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 w-full md:w-64 rounded-md border border-gray-300 py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
              </div>
            </div>
          </div>

          {/* NFT Grid and Detail View */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* NFT List */}
            <div
              className={`${selectedNft ? 'hidden lg:block' : ''} lg:col-span-${selectedNft ? '1' : '3'}`}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
                {myNfts.map(nft => (
                  <div
                    key={nft.id}
                    onClick={() => handleNftSelect(nft)}
                    className={`bg-white rounded-lg overflow-hidden border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                      selectedNft && selectedNft.id === nft.id ? 'ring-2 ring-green-600' : ''
                    }`}
                  >
                    <div className='relative'>
                      <img
                        src={nft.image || '/placeholder.svg'}
                        alt={nft.title}
                        className='w-full h-40 object-cover'
                      />
                      <div className='absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm'>
                        {categoryIcons[nft.category]}
                        {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
                      </div>
                      <div
                        className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${
                          nft.status === 'unused'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {nft.status === 'unused' ? (
                          <CheckCircle className='h-3.5 w-3.5' />
                        ) : (
                          <Clock className='h-3.5 w-3.5' />
                        )}
                        {nft.status === 'unused' ? 'Available' : 'Used'}
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-lg font-bold text-green-800 mb-1'>{nft.title}</h3>
                      <p className='text-xs text-gray-500 mb-2'>
                        Acquired: {formatDate(nft.acquiredDate)}
                      </p>
                      <p className='text-sm text-gray-600 line-clamp-2'>{nft.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state if no NFTs match filter */}
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
              <div className='w-full flex justify-center items-center lg:col-span-2 rounded-lg border-2 border-dashed border-green-200 text-green-600 opacity-80'>
                <div className='text-xl font-medium '>Select token from your collection...</div>
              </div>
            )}

            {/* NFT Detail View */}
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
                          src={selectedNft.image || '/placeholder.svg'}
                          alt={selectedNft.title}
                          className='w-full h-64 object-cover rounded-lg'
                        />
                        <div
                          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${
                            selectedNft.status === 'unused'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedNft.status !== 'unused' ? (
                            <CheckCircle className='h-3.5 w-3.5' />
                          ) : (
                            <Clock className='h-3.5 w-3.5' />
                          )}
                          {selectedNft.status !== 'unused' ? 'Available' : 'Used'}
                        </div>
                      </div>

                      <div className='flex items-center gap-2 mb-2'>
                        {categoryIcons[selectedNft.category]}
                        <span className='text-sm font-medium text-gray-600'>
                          {selectedNft.category.charAt(0).toUpperCase() +
                            selectedNft.category.slice(1)}
                        </span>
                      </div>

                      <h2 className='text-2xl font-bold text-green-800 mb-2'>
                        {selectedNft.title}
                      </h2>
                      <p className='text-gray-600 mb-4'>{selectedNft.description}</p>

                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>Acquired:</span>
                          <span className='font-medium'>
                            {formatDate(selectedNft.acquiredDate)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>Expires:</span>
                          <span className='font-medium'>{formatDate(selectedNft.expiryDate)}</span>
                        </div>
                        {selectedNft.status === 'used' && (
                          <div className='flex justify-between'>
                            <span className='text-gray-500'>Used on:</span>
                            <span className='font-medium'>{formatDate(selectedNft.usedDate)}</span>
                          </div>
                        )}
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>Token Cost:</span>
                          <span className='font-medium'>{selectedNft.tokenCost} Tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className='p-6 bg-gray-50 flex flex-col'>
                      <h3 className='text-lg font-bold text-green-800 mb-4'>Redemption Details</h3>

                      {selectedNft.status !== 'used' ? (
                        <>
                          <div className='bg-white p-4 rounded-lg border border-gray-200 mb-4'>
                            {showQrCode ? (
                              <div className='text-center'>
                                <div className='bg-white p-4 inline-block rounded-lg border border-gray-200 mb-2'>
                                  {/* This would be a real QR code in production */}
                                  <div className='w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center'>
                                    <QrCode className='h-24 w-24 text-gray-400' />
                                  </div>
                                </div>
                                <p className='text-sm text-gray-600'>
                                  Show this QR code to the cashier to redeem your reward
                                </p>
                                <button
                                  onClick={() => setShowQrCode(false)}
                                  className='mt-4 text-green-600 hover:text-green-700 font-medium text-sm'
                                >
                                  Show redemption code instead
                                </button>
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

                          <div className='space-y-4 mt-auto'>
                            <button
                              onClick={handleUseNft}
                              className='w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors'
                            >
                              Mark as Used
                            </button>

                            <div className='text-center'>
                              <a
                                href='#'
                                className='text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 justify-center'
                              >
                                View on blockchain
                                <ExternalLink className='h-3.5 w-3.5' />
                              </a>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className='flex-grow flex flex-col items-center justify-center text-center p-6'>
                          <div className='bg-gray-100 rounded-full p-4 mb-4'>
                            <Clock className='h-10 w-10 text-gray-400' />
                          </div>
                          <h4 className='text-lg font-medium text-gray-700 mb-2'>
                            This NFT has been used
                          </h4>
                          <p className='text-gray-500 mb-4'>
                            You redeemed this reward on {formatDate(selectedNft.usedDate)}.
                          </p>
                          <a
                            href='#'
                            className='text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1'
                          >
                            View transaction details
                            <ExternalLink className='h-3.5 w-3.5' />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyNftsPage;
