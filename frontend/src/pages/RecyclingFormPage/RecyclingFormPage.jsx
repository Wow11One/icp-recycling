import { Link } from "react-router-dom"
import RecyclingForm from "./RecyclingForm"
import { Recycle, ArrowLeft } from "lucide-react"

export default function RecyclingFormPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-600">EcoRecycle</span>
          </div>

          <Link to="/" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Submit Your Recycling Contribution</h1>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Thank you for recycling! Please submit a photo as proof of your recycling effort, along with the location
            and any comments you'd like to share.
          </p>

          <RecyclingForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">EcoRecycle</span>
              </div>
              <p className="text-sm text-gray-600">Making our planet greener, one recycle at a time.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-800">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="#" className="hover:text-green-600">
                    Residential Recycling
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-green-600">
                    Commercial Services
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-green-600">
                    E-Waste Recycling
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-800">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="#" className="hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-green-600">
                    Our Impact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-green-600">
                    Careers
                  </Link>
                </li>
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
  )
}

