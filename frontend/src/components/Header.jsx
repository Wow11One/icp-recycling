import React from 'react'
import InternetIdentity from '../InternetIdentity'
import { ApplicationRoutes } from '../utils/constants'
import { Recycle, Infinity } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = ({ actor, setActor, isAuthenticated, 
    setIsAuthenticated, 
    tokenCreated, setTokenCreated, setIsFetchingAuthentication,
    authClient, setAuthClient

 }) => {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white">
            <div className="container flex h-16 items-center justify-between py-4 px-10 mx-auto">
                <div className="flex items-center gap-2">
                    <Infinity className="h-7 w-7 text-green-600" />
                    <Link to={ApplicationRoutes.HomePage} className="text-xl font-bold text-green-600">Proof of Recycling</Link>
                </div>

                <nav className="flex items-center gap-6">
                    <Link to={ApplicationRoutes.RecyclingForm} className="text-sm font-medium text-gray-600 hover:text-green-600">
                        Recycling form
                    </Link>
                    <Link to={ApplicationRoutes.BonusShopPage} className="text-sm font-medium text-gray-600 hover:text-green-600">
                        Bonus shop
                    </Link>
                    <Link to={ApplicationRoutes.MyNFTsPage} className="text-sm font-medium text-gray-600 hover:text-green-600">
                        My NFTs
                    </Link>
                    <Link to={ApplicationRoutes.Profile} className="text-sm font-medium text-gray-600 hover:text-green-600">
                        Profile
                    </Link>
                    <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-green-600">
                        Contact
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    {actor && ''}
                    <InternetIdentity
                        setActor={setActor}
                        isAuthenticated={isAuthenticated}
                        setIsAuthenticated={setIsAuthenticated}
                        setIsFetchingAuthentication={setIsFetchingAuthentication}
                        setAuthClient={setAuthClient}
                        authClient={authClient}
                    />

                    {/* <button className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
            </button> */}
                </div>
            </div>
        </header>)
}

export default Header