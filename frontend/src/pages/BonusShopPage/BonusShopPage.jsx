import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Recycle, ArrowLeft, Leaf, Gift, ShoppingBag, Coffee, Ticket, Award, AlertCircle } from 'lucide-react';

// Mock data for NFT rewards
const nftRewards = [
  {
    id: 1,
    title: "10% Off at Ecomarket for plastic bottle of cola",
    description: "Get 10% off your next purchase at Ecomarket for plastic bottle of cola. Valid for 30 days after minting.",
    tokenCost: 50,
    image: "https://omixcdn.com/img/catalog/napitok-coca-cola-0-5l-10665.jpg",
    category: "discount"
  },
  {
    id: 2,
    title: "Free Coffee at GreenBean",
    description: "Enjoy a free coffee of your choice at any GreenBean location. No expiration.",
    tokenCost: 75,
    image: "/placeholder.svg?height=200&width=200",
    category: "freebie"
  },
  {
    id: 3,
    title: "Eco-Friendly Tote Bag",
    description: "Redeem for a limited edition recycled material tote bag. While supplies last.",
    tokenCost: 100,
    image: "/placeholder.svg?height=200&width=200",
    category: "merchandise"
  },
  {
    id: 4,
    title: "Plant a Tree Certificate",
    description: "We'll plant a tree in your name and send you a digital certificate with GPS coordinates.",
    tokenCost: 150,
    image: "/placeholder.svg?height=200&width=200",
    category: "impact"
  },
  {
    id: 5,
    title: "25% Off Recycled Products",
    description: "Get 25% off any product made from recycled materials at participating stores.",
    tokenCost: 125,
    image: "/placeholder.svg?height=200&width=200",
    category: "discount"
  },
  {
    id: 6,
    title: "Exclusive Recycling Workshop",
    description: "Access to our exclusive online workshop about advanced recycling techniques.",
    tokenCost: 200,
    image: "/placeholder.svg?height=200&width=200",
    category: "experience"
  }
];

// Category icons mapping
const categoryIcons = {
  discount: <ShoppingBag className="h-5 w-5" />,
  freebie: <Coffee className="h-5 w-5" />,
  merchandise: <Gift className="h-5 w-5" />,
  impact: <Leaf className="h-5 w-5" />,
  experience: <Ticket className="h-5 w-5" />
};

function BonusShopPage() {
  const [tokenBalance, setTokenBalance] = useState(300);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  const filteredNfts = selectedCategory === "all" 
    ? nftRewards 
    : nftRewards.filter(nft => nft.category === selectedCategory);

  const handleExchange = (nft) => {
    setSelectedNft(nft);
    setShowModal(true);
  };

  const confirmExchange = () => {
    if (selectedNft && tokenBalance >= selectedNft.tokenCost) {
      setTokenBalance(prev => prev - selectedNft.tokenCost);
      setShowModal(false);
      alert(`Successfully exchanged for "${selectedNft.title}" NFT!`);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-600">EcoRecycle</span>
          </div>
          
          <Link 
            to="/" 
            className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                Recycling Bonus Shop
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Exchange your recycling tokens for exclusive NFTs that can be used for discounts and special offers at participating stores.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white p-3 rounded-lg border border-green-200 shadow-sm">
              <Award className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-700">Your Balance:</span>
              <span className="text-xl font-bold text-green-600">{tokenBalance} Tokens</span>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === "all" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                All Rewards
              </button>
              <button 
                onClick={() => setSelectedCategory("discount")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === "discount" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                <ShoppingBag className="h-4 w-4" /> Discounts
              </button>
              <button 
                onClick={() => setSelectedCategory("freebie")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === "freebie" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                <Coffee className="h-4 w-4" /> Freebies
              </button>
              <button 
                onClick={() => setSelectedCategory("merchandise")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === "merchandise" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                <Gift className="h-4 w-4" /> Merchandise
              </button>
              <button 
                onClick={() => setSelectedCategory("impact")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === "impact" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                <Leaf className="h-4 w-4" /> Environmental Impact
              </button>
              <button 
                onClick={() => setSelectedCategory("experience")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                  selectedCategory === "experience" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                <Ticket className="h-4 w-4" /> Experiences
              </button>
            </div>
          </div>
          
          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNfts.map((nft) => (
              <div key={nft.id} className="bg-white rounded-lg overflow-hidden border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={nft.image || "/placeholder.svg"} 
                    alt={nft.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-green-800 flex items-center gap-1 shadow-sm">
                    {categoryIcons[nft.category]}
                    {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-green-800 mb-2">{nft.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{nft.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Award className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-600">{nft.tokenCost} Tokens</span>
                    </div>
                    <button
                      onClick={() => handleExchange(nft)}
                      disabled={tokenBalance < nft.tokenCost}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        tokenBalance >= nft.tokenCost
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {tokenBalance >= nft.tokenCost ? "Exchange Tokens" : "Not Enough Tokens"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty state if no NFTs match filter */}
          {filteredNfts.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No rewards found</h3>
              <p className="text-gray-500">Try selecting a different category or check back later for new rewards.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Confirmation Modal */}
      {showModal && selectedNft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Confirm Exchange</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to exchange <span className="font-bold">{selectedNft.tokenCost} tokens</span> for "{selectedNft.title}" NFT?
            </p>
            
            <div className="bg-green-50 p-3 rounded-md mb-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                This action cannot be undone. The NFT will be minted to your connected wallet.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmExchange}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Exchange
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">EcoRecycle</span>
              </div>
              <p className="text-sm text-gray-600">
                Making our planet greener, one recycle at a time.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-800">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-green-600">Residential Recycling</Link></li>
                <li><Link to="#" className="hover:text-green-600">Commercial Services</Link></li>
                <li><Link to="#" className="hover:text-green-600">E-Waste Recycling</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-800">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-green-600">About Us</Link></li>
                <li><Link to="#" className="hover:text-green-600">Our Impact</Link></li>
                <li><Link to="#" className="hover:text-green-600">Careers</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-800">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>123 Green Street</li>
                <li>Eco City, EC 12345</li>
                <li>info@ecorecycle.com</li>
                <li>(123) 456-7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6">
            <p className="text-center text-xs text-gray-600">
              © 2025 EcoRecycle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BonusShopPage;
