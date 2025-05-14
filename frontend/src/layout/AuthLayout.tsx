import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApplicationRoutes } from '../utils/constants';

const AuthLayout = ({ actor, isAuthenticated, isFetchingAuthentication }) => {
  console.log('actor', actor);
  if (!isAuthenticated) {
    return <Navigate to={ApplicationRoutes.LoginPage} />;
  }

  console.log(isFetchingAuthentication);
  if (isFetchingAuthentication) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <div className='animate-spin size-10 border-4 mb-10 border-green-500  border-t-transparent rounded-full' />
      </div>
    );
  }

  return <Outlet />;
};

export default AuthLayout;
