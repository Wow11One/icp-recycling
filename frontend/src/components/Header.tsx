import { useState } from "react"
import { Infinity, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import InternetIdentity from "../InternetIdentity"
import { ApplicationRoutes } from "../utils/constants"

const Header = ({
  actor,
  setActor,
  isAuthenticated,
  setIsAuthenticated,
  setIsFetchingAuthentication,
  authClient,
  setAuthClient,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navigationLinks = [
    { to: ApplicationRoutes.RecyclingForm, label: "Recycling form" },
    { to: ApplicationRoutes.BonusShopPage, label: "Bonus shop" },
    { to: ApplicationRoutes.MyNFTsPage, label: "My NFTs" },
    { to: ApplicationRoutes.NftMintPage, label: "NFT minting" },
    { to: ApplicationRoutes.Profile, label: "Profile" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4 px-4 sm:px-6 lg:px-10 mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Infinity className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
          <Link
            to={ApplicationRoutes.HomePage}
            className="text-lg sm:text-xl font-bold text-green-600"
            onClick={closeMobileMenu}
          >
            <span className="hidden sm:inline">Proof of Recycling</span>
            <span className="sm:hidden">PoR</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth */}
          <div className="hidden sm:block">
            <InternetIdentity
              setActor={setActor}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              setIsFetchingAuthentication={setIsFetchingAuthentication}
              setAuthClient={setAuthClient}
              authClient={authClient}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div className="pt-4 border-t">
              <InternetIdentity
                setActor={setActor}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                setIsFetchingAuthentication={setIsFetchingAuthentication}
                setAuthClient={setAuthClient}
                authClient={authClient}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
