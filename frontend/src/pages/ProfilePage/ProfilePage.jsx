import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Recycle, Award, Settings, Calendar, MapPin, Clock, ChevronRight, Leaf, BarChart3, ShoppingBag } from 'lucide-react';
import React from "react";
import { ApplicationRoutes } from "../../utils/constants";
import { AuthClient } from "@dfinity/auth-client";
import { createActor as createDip20Actor, canisterId as dip20CanisterId } from 'declarations/dip20';
import { createActor as createStorageActor, canisterId as storageCanisterId } from 'declarations/storage';

const userData = {
  name: "Alex Green",
  username: "ecoalex",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "2023-05-15",
  location: "Eco City, EC",
  recyclingPoints: 450,
  nftsOwned: 5,
  totalRecycled: "125kg",
  carbonSaved: "75kg",
  bio: "Garbage collector"
};

const recentActivity = [
  {
    id: "act-001",
    type: "recycling",
    title: "Plastic Bottles Recycled",
    date: "2023-11-10",
    points: 25,
    location: "Downtown Recycling Center",
    image: "/placeholder.svg?height=60&width=60"
  },
  {
    id: "act-002",
    type: "nft",
    title: "Redeemed 'Free Coffee' NFT",
    date: "2023-11-05",
    points: -75,
    location: "GreenBean Café",
    image: "/placeholder.svg?height=60&width=60"
  },
  {
    id: "act-003",
    type: "recycling",
    title: "E-Waste Recycling",
    date: "2023-10-28",
    points: 50,
    location: "Tech Recycling Hub",
    image: "/placeholder.svg?height=60&width=60"
  },
  {
    id: "act-004",
    type: "nft",
    title: "Purchased 'Plant a Tree' NFT",
    date: "2023-10-15",
    points: -150,
    location: "Bonus Shop",
    image: "/placeholder.svg?height=60&width=60"
  },
  {
    id: "act-005",
    type: "recycling",
    title: "Paper Recycling",
    date: "2023-10-10",
    points: 15,
    location: "Community Center",
    image: "/placeholder.svg?height=60&width=60"
  }
];

function ProfilePage({ principal, authClient }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [actor, setActor] = useState();
  const [porBalance, setPorBalance] = useState(0);
  const [recycleRecords, setRecycleRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const initData = async () => {
    setIsFetching(true)
    try {
      const identity = authClient.getIdentity();
      const dip20Actor = createDip20Actor(dip20CanisterId, {
        agentOptions: {
          identity,
        }
      });

      const storageActor = createStorageActor(storageCanisterId, {
        agentOptions: {
          identity,
        }
      })

      const balance = await dip20Actor.balance_of(principal.getPrincipal().toString());
      setPorBalance(
        Number(balance)
      );

      const usersRecycleRecords = await storageActor.get_recycle_data(principal.getPrincipal().toString())
      setRecycleRecords(usersRecycleRecords)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    async function init() {
     await initData();
    }
    init().finally(() => setIsFetching(false));
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="h-32 bg-green-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden">
                  <img
                    src='https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg pt-12 font-bold text-green-800">@{principal.getPrincipal().toString()}</h1>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Link to={ApplicationRoutes.RecyclingForm} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                    <Recycle className="h-4 w-4" />
                    Register recycling
                  </Link>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-600">{userData.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Joined today
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Ukraine
                </div>
              </div>
            </div>
          </div>

          {isFetching && (
            <div className="h-full w-full flex justify-center items-center">
              <div className='animate-spin size-10 border-4 mb-36 border-green-500  border-t-transparent rounded-full' />
            </div>
          )}
          {!isFetching && (
            <>

              <h3 className='text-xl text-center my-5 text-green-600 font-semibold'>
                You are doing well! Your progress:
              </h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-2 mb-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-800">{porBalance}</span>
                  <span className="text-sm text-gray-600">PoR balance</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-800">{0}</span>
                  <span className="text-sm text-gray-600">NFTs Owned</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-2 mb-2">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-800">{recycleRecords.length || 0}</span>
                  <span className="text-sm text-gray-600">Total Recycled</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-800">10000</span>
                  <span className="text-sm text-gray-600">Carbon Saved</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`px-4 py-3 text-sm font-medium ${activeTab === "activity"
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-600 hover:text-green-600"
                        }`}
                    >
                      Recent Activity
                    </button>
                    <button
                      onClick={() => setActiveTab("nfts")}
                      className={`px-4 py-3 text-sm font-medium ${activeTab === "nfts"
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-600 hover:text-green-600"
                        }`}
                    >
                      My NFTs
                    </button>
                    <button
                      onClick={() => setActiveTab("stats")}
                      className={`px-4 py-3 text-sm font-medium ${activeTab === "stats"
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-600 hover:text-green-600"
                        }`}
                    >
                      Recycling Stats
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {activeTab === "activity" && (
                    <div className="space-y-4">

                      {!recycleRecords.length && (
                        <h2 className="text-base font-medium text-green-600 mb-4 text-center">No recent activity yet</h2>
                      )}
                      {recycleRecords.map((record) => (
                        <div key={record.principal_id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          {/* <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={'activity.image || "/placeholder.svg"'} 
                          alt={activity.title} 
                          className="h-full w-full object-cover"
                        />
                      </div> */}
                          <div className="rounded-xl bg-green-100 p-2 mb-2">
                            <Leaf className="h-10 w-10 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{record.comment}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                Today
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {record.location}
                              </div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${100 > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            1000 points
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}

                      {/* <div className="text-center mt-6">
                    <button className="text-sm font-medium text-green-600 hover:text-green-700">
                      View All Activity
                    </button>
                  </div> */}
                    </div>
                  )}

                  {activeTab === "nfts" && (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">View Your NFT Collection</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Check out all the NFTs you've earned through recycling and manage your rewards.
                      </p>
                      <Link
                        to={ApplicationRoutes.MyNFTsPage}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Go to My NFTs
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}

                  {activeTab === "stats" && (
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Detailed Recycling Statistics</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Track your recycling progress over time and see your environmental impact.
                      </p>
                      <button className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                        View Detailed Stats
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
