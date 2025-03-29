import { Link } from "react-router-dom"
import RecyclingForm from "./RecyclingForm"
import { Recycle } from "lucide-react"
import React from "react"

export default function RecyclingFormPage() {
  return (
    <div className="min-h-screen bg-green-50">

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
    </div>
  )
}

