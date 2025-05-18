import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from 'declarations/backend';
import { ApplicationRoutes } from './utils/constants';
import { Link } from 'react-router-dom';
import { useSiws } from 'ic-siws-js/react';


const InternetIdentity = ({
  setActor,
  isAuthenticated,
  setIsAuthenticated,
  setIsFetchingAuthentication,
  authClient,
  setAuthClient,
}) => {
  const { identity: solanaIdentity, clear } = useSiws();
  //const { solanaIdentity, setSolanaIdentity } = useAuth();
  const [principal, setPrincipal] = useState();
  useEffect(() => {
    updateActor();
  }, []);

  async function updateActor() {
    setIsFetchingAuthentication(true);
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(identity.getPrincipal().toString());
    setIsFetchingAuthentication(false);
  }

  async function logout() {
    await authClient.logout();
    clear();
    updateActor();
  }

  return (
    <div className='flex items-center space-x-4'>
      {isAuthenticated || solanaIdentity ? (
        <>
          <p className='text-sm'>{/* <span className="font-mono">{principal}</span> */}</p>
          <button
            onClick={logout}
            className='transform rounded-lg bg-red-500 p-2.5 text-sm font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link to={ApplicationRoutes.LoginPage} className='secondary-button'>
            Sign in
          </Link>
        </>
      )}
    </div>
  );
};

export default InternetIdentity;
