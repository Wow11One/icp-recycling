import React, { useState, useEffect } from 'react';
import ApproveSpender from './TokenApprove';
import AuthWarning from './AuthWarning';
import BalanceChecker from './BalanceChecker';
import Header from './Header';
import TransferFrom from './TokenTransfer';
import TokenInfo from './TokenInfo';
import TokenSender from './TokenSender';
import CreateToken from './CreateToken';
import { ApplicationRoutes } from './utils/constants';
import HomePage from './pages/HomePage';
import RecyclingFormPage from './pages/RecyclingFormPage';
import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import BonusShopPage from './pages/BonusShopPage';
import MyNFTsPage from './pages/MyNFTsPage';
import LoginPage from './pages/LoginPage';
import HeaderFooterLayout from './layout/HeaderFooterLayout';
import ProfilePage from './pages/ProfilePage';
import AuthLayout from './layout/AuthLayout';
import { Slide, ToastContainer } from 'react-toastify';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFetchingAuthentication, setIsFetchingAuthentication] = useState(true);
  const [totalSupply, setTotalSupply] = useState('');
  const [actor, setActor] = useState();
  const [tokenCreated, setTokenCreated] = useState(false);
  const [decimals, setDecimals] = useState(0n);
  const [principal, setPrincipal] = useState();
  const [authClient, setAuthClient] = useState();

  console.log('principal', principal)

  const updateSupply = async () => {
    try {
      const supply = await actor.icrc1_total_supply();
      const decimals = BigInt(await actor.icrc1_decimals());
      setTotalSupply(`${Number(supply) / Number(10n ** decimals)}`);
      setDecimals(decimals);
    } catch (error) {
      console.error('Error fetching total supply:', error);
    }
  };

  const checkTokenCreated = async () => {
    try {
      const result = await actor.token_created();
      setTokenCreated(result);
      console.log('hello world')
    } catch (error) {
      console.error('Error fetching token created status:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated || tokenCreated) {
      updateSupply();
    }
  }, [isAuthenticated, tokenCreated]);

  useEffect(() => {
    
  }, [actor]);

  return (
    <BrowserRouter>
    <ToastContainer transition={Slide} theme='light' />
      <Routes>
        <Route
          element={
            <HeaderFooterLayout
              actor={actor}
              setActor={setActor}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              tokenCreated={tokenCreated}
              setTokenCreated={setTokenCreated}
              setIsFetchingAuthentication={setIsFetchingAuthentication}
              authClient={authClient} 
              setAuthClient={setAuthClient}
            />
          }
        >
          <Route index path={ApplicationRoutes.HomePage} element={<HomePage />} />
            <Route
              path={ApplicationRoutes.LoginPage}
              element={
                <LoginPage
                  setActor={setActor}
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                  setPrincipal={setPrincipal}
                />
              }
            />
          <Route element={<AuthLayout actor={actor} isFetchingAuthentication={isFetchingAuthentication} isAuthenticated={isAuthenticated} />} >
            <Route path={ApplicationRoutes.RecyclingForm} element={<RecyclingFormPage principal={principal} />} />
            <Route path={ApplicationRoutes.BonusShopPage} element={<BonusShopPage authClient={authClient} principal={principal} />} />
            <Route path={ApplicationRoutes.MyNFTsPage} element={<MyNFTsPage />} />
            <Route path={ApplicationRoutes.Profile} element={<ProfilePage authClient={authClient} principal={principal} />} />
          </Route>

          {/* <div className='min-h-screen bg-gray-100'>
        <Header
          actor={actor}
          setActor={setActor}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          tokenCreated={tokenCreated}
          setTokenCreated={setTokenCreated}
        />
        {tokenCreated ? (
          <div>
            <TokenInfo totalSupply={totalSupply} />
            <div className='mx-auto'>
              {isAuthenticated ? (
                <div className='grid grid-cols-1 gap-8 px-4 md:grid-cols-4 lg:grid-cols-3'>
                  <BalanceChecker decimals={decimals} />
                  <TokenSender actor={actor} updateSupply={updateSupply} decimals={decimals} />
                  <ApproveSpender actor={actor} decimals={decimals} />
                  <TransferFrom actor={actor} decimals={decimals} />
                </div>
              ) : (
                <AuthWarning />
              )}
            </div>
          </div>
        ) : (
          <div>
            {isAuthenticated ? (
              <CreateToken actor={actor} setTokenCreated={setTokenCreated} />
            ) : (
              <AuthWarning />
            )}
          </div>
        )}
      </div> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
