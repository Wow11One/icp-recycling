import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Award,
  Settings,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Leaf,
  BarChart3,
  ShoppingBag,
  Gift,
  Lightbulb,
  HelpCircle,
  X,
} from 'lucide-react';
import { ApplicationRoutes } from '../../utils/constants';
import { AuthClient } from '@dfinity/auth-client';
import { createActor as createDip20Actor, canisterId as dip20CanisterId } from 'declarations/dip20';
import {
  createActor as createStorageActor,
  canisterId as storageCanisterId,
} from 'declarations/storage';
import { useSiws } from 'ic-siws-js/react';
import Chart from 'react-apexcharts';
import toastNotifications from '../../utils/toastNotifications.utils';
import WheelComponent from '../../components/WheelComponent';

const userData = {
  name: 'Alex Green',
  username: 'ecoalex',
  avatar: '/placeholder.svg?height=100&width=100',
  joinDate: '2023-05-15',
  location: 'Eco City, EC',
  recyclingPoints: 450,
  nftsOwned: 5,
  totalRecycled: '125kg',
  carbonSaved: '75kg',
  bio: 'Garbage collector',
};

const RecyclingActivityGraph = () => {
  const recyclingData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 7 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 6 },
    { day: 'Sun', count: 3 },
  ];
  const maxCount = Math.max(...recyclingData.map(item => item.count));

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 flex items-end'>
        {recyclingData.map((item, index) => (
          <div key={index} className='flex-1 flex flex-col items-center'>
            <div
              className='w-full max-w-[30px] bg-green-500 rounded-t-md mx-auto'
              style={{
                height: `${(item.count / maxCount) * 100}%`,
                opacity: 0.6 + (item.count / maxCount) * 0.4,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className='flex justify-between mt-2 border-t pt-2'>
        {recyclingData.map((item, index) => (
          <div key={index} className='flex-1 text-center'>
            <div className='text-xs font-medium text-gray-600'>{item.day}</div>
            <div className='text-xs text-gray-500'>{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { identity: solanaIdentity } = useSiws();
  const [activeTab, setActiveTab] = useState('activity');
  const [porBalance, setPorBalance] = useState(0);
  const [recycleRecords, setRecycleRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [dailyTokens, setDailyTokens] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Mock eco quiz questions
  const ecoQuizQuestions = [
    {
      question: 'Which of these items cannot be recycled?',
      options: ['Plastic bottles', 'Styrofoam containers', 'Cardboard boxes', 'Aluminum cans'],
      correctAnswer: 'Styrofoam containers',
    },
    {
      question: 'What is the most effective way to reduce waste?',
      options: ['Recycling', 'Reducing consumption', 'Composting', 'Buying eco-friendly products'],
      correctAnswer: 'Reducing consumption',
    },
    {
      question: 'How much water can be saved by turning off the tap while brushing teeth?',
      options: ['Up to 2 gallons', 'Up to 5 gallons', 'Up to 8 gallons', 'Up to 10 gallons'],
      correctAnswer: 'Up to 8 gallons',
    },
  ];

  // Handle daily token claim
  const handleClaimDailyTokens = () => {
    // Generate random token amount between 5 and 25
    const tokens = Math.floor(Math.random() * 21) + 5;
    setDailyTokens(tokens);
  };

  // Handle quiz answer
  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = answer;
    setQuizAnswers(newAnswers);

    if (currentQuestion < ecoQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate correct answers
      const correctCount = newAnswers.filter(
        (answer, index) => answer === ecoQuizQuestions[index].correctAnswer,
      ).length;

      setQuizCompleted(true);
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setShowQuizModal(false);
  };

  const recyclingData = [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 1 },
    { day: 'Sun', count: 2 },
  ];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '70%',
        distributed: false,
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#10b981'], // Green color to match theme
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['#f8f8f8', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: recyclingData.map(item => item.day),
      position: 'bottom',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Items Recycled',
        style: {
          color: '#64748b',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
      },
    },
    tooltip: {
      y: {
        formatter: val => val + ' items',
      },
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    legend: {
      show: false,
    },
    title: {
      text: undefined,
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.2,
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Items Recycled',
      data: recyclingData.map(item => item.count),
    },
  ];

  const initData = async () => {
    setIsFetching(true);
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const dip20Actor = createDip20Actor(dip20CanisterId, {
        agentOptions: {
          identity: solanaIdentity || identity,
        },
      });

      const storageActor = createStorageActor(storageCanisterId, {
        agentOptions: {
          identity: solanaIdentity || identity,
        },
      });

      const balance = await dip20Actor.balance_of(identity.getPrincipal().toString());
      setPorBalance(Number(balance));

      const usersRecycleRecords = await storageActor.get_recycle_data(
        identity.getPrincipal().toString(),
      );
      setRecycleRecords(usersRecycleRecords);
    } catch (err) {
      console.log(err);
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
    <>
      <div className='min-h-screen bg-green-50'>
        <main className='container mx-auto py-8 px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
              <div className='h-32 bg-green-600'></div>
              <div className='px-6 pb-6 relative'>
                <div className='flex flex-col md:flex-row md:items-end gap-4 -mt-12'>
                  <div className='h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden'>
                    <img
                      src='https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
                      alt={userData.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h1 className='text-lg pt-12 font-bold text-green-800'>
                      @
                      {solanaIdentity
                        ? solanaIdentity.getPrincipal().toString()
                        : principal.getPrincipal().toString()}
                    </h1>
                  </div>
                  <div className='flex gap-2 mt-4 md:mt-0'>
                    <Link
                      to={ApplicationRoutes.RecyclingForm}
                      className='flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700'
                    >
                      <Recycle className='h-4 w-4' />
                      Register recycling
                    </Link>
                    <button className='flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50'>
                      <Settings className='h-4 w-4' />
                      <span className='hidden sm:inline'>Settings</span>
                    </button>
                  </div>
                </div>

                <div className='mt-6'>
                  <p className='text-gray-600'>{userData.bio}</p>
                </div>

                <div className='flex flex-wrap gap-4 mt-4'>
                  <div className='flex items-center gap-1 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4 text-gray-500' />
                    Joined today
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4 text-gray-500' />
                    Ukraine
                  </div>
                </div>
              </div>
            </div>

            {isFetching && (
              <div className='h-full w-full flex justify-center items-center'>
                <div className='animate-spin size-10 border-4 mb-36 border-green-500  border-t-transparent rounded-full' />
              </div>
            )}
            {!isFetching && (
              <>
                <h3 className='text-xl text-center my-5 text-green-600 font-semibold'>
                  You are doing well! Your progress:
                </h3>

                {/* Stats Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-white rounded-lg shadow-sm p-4 flex flex-col items-center'>
                    <div className='rounded-full bg-green-100 p-2 mb-2'>
                      <Leaf className='h-5 w-5 text-green-600' />
                    </div>
                    <span className='text-2xl font-bold text-green-800'>{porBalance}</span>
                    <span className='text-sm text-gray-600'>PoR balance</span>
                  </div>

                  <div className='bg-white rounded-lg shadow-sm p-4 flex flex-col items-center'>
                    <div className='rounded-full bg-green-100 p-2 mb-2'>
                      <Award className='h-5 w-5 text-green-600' />
                    </div>
                    <span className='text-2xl font-bold text-green-800'>{0}</span>
                    <span className='text-sm text-gray-600'>NFTs Owned</span>
                  </div>

                  <div className='bg-white rounded-lg shadow-sm p-4 flex flex-col items-center'>
                    <div className='rounded-full bg-green-100 p-2 mb-2'>
                      <Recycle className='h-5 w-5 text-green-600' />
                    </div>
                    <span className='text-2xl font-bold text-green-800'>
                      {recycleRecords.length || 0}
                    </span>
                    <span className='text-sm text-gray-600'>Total Recycled</span>
                  </div>

                  <div className='bg-white rounded-lg shadow-sm p-4 flex flex-col items-center'>
                    <div className='rounded-full bg-green-100 p-2 mb-2'>
                      <BarChart3 className='h-5 w-5 text-green-600' />
                    </div>
                    <span className='text-2xl font-bold text-green-800'>10000</span>
                    <span className='text-sm text-gray-600'>Carbon Saved</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                  <div className='border-b'>
                    <div className='flex'>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-4 py-3 text-sm font-medium ${
                          activeTab === 'activity'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        Recent Activity
                      </button>
                      <button
                        onClick={() => setActiveTab('nfts')}
                        className={`px-4 py-3 text-sm font-medium ${
                          activeTab === 'nfts'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        My NFTs
                      </button>
                      <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-3 text-sm font-medium ${
                          activeTab === 'stats'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        Recycling Stats
                      </button>
                    </div>
                  </div>

                  <div className='p-4'>
                    {activeTab === 'activity' && (
                      <div className='space-y-4'>
                        {!recycleRecords.length && (
                          <h2 className='text-base font-medium text-green-600 mb-4 text-center'>
                            No recent activity yet
                          </h2>
                        )}
                        {recycleRecords.map(record => (
                          <div
                            key={record.principal_id}
                            className='flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'
                          >
                            {/* <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={'activity.image || "/placeholder.svg"'} 
                          alt={activity.title} 
                          className="h-full w-full object-cover"
                        />
                      </div> */}
                            <div className='rounded-xl bg-green-100 p-2 mb-2'>
                              <Leaf className='h-10 w-10 text-green-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='text-sm font-medium text-gray-900 truncate'>
                                {record.comment}
                              </h3>
                              <div className='flex items-center gap-2 mt-1'>
                                <div className='flex items-center gap-1 text-xs text-gray-500'>
                                  <Clock className='h-3 w-3' />
                                  Today
                                </div>
                                <div className='flex items-center gap-1 text-xs text-gray-500'>
                                  <MapPin className='h-3 w-3' />
                                  {record.location}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                100 > 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              1000 points
                            </div>
                            <ChevronRight className='h-4 w-4 text-gray-400' />
                          </div>
                        ))}

                        {/* <div className="text-center mt-6">
                    <button className="text-sm font-medium text-green-600 hover:text-green-700">
                      View All Activity
                    </button>
                  </div> */}
                      </div>
                    )}

                    {activeTab === 'nfts' && (
                      <div className='text-center py-12'>
                        <ShoppingBag className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-700 mb-2'>
                          View Your NFT Collection
                        </h3>
                        <p className='text-gray-500 max-w-md mx-auto mb-6'>
                          Check out all the NFTs you've earned through recycling and manage your
                          rewards.
                        </p>
                        <Link
                          to={ApplicationRoutes.MyNFTsPage}
                          className='inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700'
                        >
                          Go to My NFTs
                          <ChevronRight className='h-4 w-4' />
                        </Link>
                      </div>
                    )}

                    {activeTab === 'stats' && (
                      <div className='space-y-6'>
                        <h2 className='text-lg font-medium text-green-800 mb-4'>
                          Your Recycling Stats
                        </h2>

                        <div className='bg-white p-4 rounded-lg border border-green-200'>
                          <h3 className='text-sm font-medium text-green-800 mb-3'>
                            Recycling Activity (Last 7 Days)
                          </h3>
                          <div className='h-64 w-full'>
                            <Chart
                              options={chartOptions}
                              series={chartSeries}
                              type='bar'
                              height='100%'
                              width='100%'
                            />
                          </div>
                        </div>

                        {/* Daily Rewards */}
                        <div className='bg-white p-4 rounded-lg border border-green-200'>
                          <h3 className='text-sm font-medium text-green-800 mb-3'>Daily Rewards</h3>
                          <p className='text-sm text-gray-600 mb-4'>
                            Claim your daily rewards and earn extra recycling tokens!
                          </p>
                          <div className='flex flex-col sm:flex-row gap-3'>
                            <button
                              onClick={() => setShowTokenModal(true)}
                              className='flex-1 flex items-center justify-center gap-2 px-4 py-3 primary-button'
                            >
                              <Gift className='h-5 w-5' />
                              <span>Claim Daily Tokens</span>
                            </button>
                            <button
                              onClick={() => setShowQuizModal(true)}
                              className='flex-1 flex items-center justify-center gap-2 px-4 py-3 secondary-button'
                            >
                              <HelpCircle className='h-5 w-5' />
                              <span>Eco Quiz Reward</span>
                            </button>
                          </div>
                        </div>

                        <div className='bg-white p-4 rounded-lg border border-green-200'>
                          <h3 className='text-sm font-medium text-green-800 mb-3'>
                            Recycling Streak
                          </h3>
                          <div className='flex items-center gap-4'>
                            <div className='h-16 w-16 rounded-full bg-green-100 flex items-center justify-center'>
                              <span className='text-2xl font-bold text-green-600'>2</span>
                            </div>
                            <div>
                              <p className='font-medium text-gray-800'>2 Day Streak!</p>
                              <p className='text-sm text-gray-600'>
                                Keep recycling daily to maintain your streak
                              </p>
                              <div className='mt-2 w-full bg-gray-200 rounded-full h-2.5'>
                                <div
                                  className='bg-green-600 h-2.5 rounded-full'
                                  style={{ width: '40%' }}
                                ></div>
                              </div>
                              <p className='text-xs text-gray-500 mt-1'>
                                3 more days until your next reward bonus
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='bg-white p-4 rounded-lg border border-green-200'>
                          <div className='flex justify-between items-center mb-3'>
                            <h3 className='text-sm font-medium text-green-800'>
                              Community Leaderboard
                            </h3>
                            {/* <Link to='#' className='text-xs text-green-600 hover:text-green-700'>
                            View Full Leaderboard
                          </Link> */}
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center p-2 bg-green-50 rounded-md'>
                              <span className='w-6 text-center font-medium text-green-800'>1</span>
                              <div className='h-8 w-8 rounded-full bg-gray-200 mx-2'></div>
                              <span className='flex-1 font-medium text-gray-800'>
                                @qpeap-pdqpt-h34km-7dubb
                              </span>
                              <span className='font-medium text-green-600'>3000 POR</span>
                            </div>
                            {/* <div className='flex items-center p-2 border border-green-200 rounded-md'>
                              <span className='w-6 text-center font-medium text-green-600'>8</span>
                              <div className='h-8 w-8 rounded-full overflow-hidden mx-2'>
                                <img
                                  src={userData.avatar || '/placeholder.svg'}
                                  alt={userData.name}
                                  className='h-full w-full object-cover'
                                />
                              </div>
                              <span className='flex-1 font-medium text-gray-800'>You</span>
                              <span className='font-medium text-green-600'>450 POR</span>
                            </div> */}
                          </div>
                        </div>
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

      {showQuizModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-6'>
            <div className='text-center'>
              {!quizCompleted ? (
                <>
                  <HelpCircle className='h-12 w-12 text-green-600 mx-auto mb-4' />
                  <h3 className='text-xl font-bold text-green-800 mb-2'>Eco Quiz Challenge</h3>
                  <div className='flex justify-center gap-1 mb-4'>
                    {ecoQuizQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-8 rounded-full ${
                          index === currentQuestion
                            ? 'bg-green-600'
                            : index < currentQuestion
                              ? 'bg-green-300'
                              : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className='text-gray-800 font-medium mb-6'>
                    {ecoQuizQuestions[currentQuestion].question}
                  </p>
                  <div className='space-y-2 mb-6'>
                    {ecoQuizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(option)}
                        className='w-full py-2 px-4 border border-green-300 rounded-md text-left text-gray-700 hover:bg-green-50'
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Leaf className='h-12 w-12 text-green-600 mx-auto mb-4' />
                  <h3 className='text-xl font-bold text-green-800 mb-2'>Quiz Completed!</h3>
                  <p className='text-green-600 text-lg font-medium mb-2'>
                    You got{' '}
                    {
                      quizAnswers.filter(
                        (answer, index) => answer === ecoQuizQuestions[index].correctAnswer,
                      ).length
                    }{' '}
                    out of {ecoQuizQuestions.length} correct!
                  </p>
                  <p className='text-gray-600 mb-4'>
                    You've earned{' '}
                    {quizAnswers.filter(
                      (answer, index) => answer === ecoQuizQuestions[index].correctAnswer,
                    ).length * 10}{' '}
                    recycling tokens as a reward.
                  </p>
                  <div className='bg-green-50 p-3 rounded-md mb-6'>
                    <p className='text-sm text-green-800'>
                      Come back tomorrow for a new set of questions and more chances to earn tokens!
                    </p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className='px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700'
                  >
                    Claim Reward
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setShowQuizModal(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </div>
      )}

      {showTokenModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-6'>
            <div className='text-center'>
              {dailyTokens === 0 ? (
                <>
                  <Gift className='h-12 w-12 mx-auto mb-4 secondary-button' />
                  <h3 className='text-xl font-bold text-green-800 mb-4'>Claim Your Daily Tokens</h3>
                  <p className='text-gray-600 mt-3 mb-6'>
                    Spin the wheel to find out your reward today!
                  </p>
                  <div className='flex justify-center items-center mb-8'>
                    <WheelComponent
                      segments={['10', '15', '25', '30', '35', '55']}
                      segColors={['white', 'white', 'white', 'white', 'white', 'white', 'white']}
                      winningSegment='15'
                      onFinished={(winner: any) => {
                        toastNotifications.success(`You get ${winner} tokens`);
                      }}
                      primaryColor='#00a63e'
                      primaryColoraround='#00a63e'
                      contrastColor='white'
                      buttonText='Spin'
                      isOnlyOnce={false}
                      size={135}
                      upDuration={1000}
                      downDuration={2000}
                      onRotate={undefined}
                      onRotatefinish={undefined}
                    />
                  </div>
                  <button
                    onClick={handleClaimDailyTokens}
                    className='px-4 py-2 bg-green-600 rounded-md text-white font-medium hover:bg-green-700'
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <div className='flex items-center justify-center mb-4'>
                    <div className='relative'>
                      <Award className='h-16 w-16 text-green-600' />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-white font-bold'>{dailyTokens}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className='text-xl font-bold text-green-800 mb-2'>Congratulations!</h3>
                  <p className='text-green-600 text-lg font-medium mb-2'>
                    You've earned {dailyTokens} recycling tokens!
                  </p>
                  <p className='text-gray-600 mb-6'>
                    Come back tomorrow to claim more tokens and keep your recycling streak going.
                  </p>
                  <button
                    onClick={() => setShowTokenModal(false)}
                    className='px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700'
                  >
                    Awesome!
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setShowTokenModal(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
