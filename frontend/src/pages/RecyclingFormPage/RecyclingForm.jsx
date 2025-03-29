import { useState } from "react"
import { Recycle, MapPin, MessageSquare, Upload, X } from "lucide-react"
import React from "react";
import toastNotifications from "../../utils/toastNotifications.utils";
import { idlFactory, canisterId } from "./declarations/storage";

const RecyclingForm = () => {
    const [formData, setFormData] = useState({
        location: "",
        comment: "",
    })
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setPhoto(selectedFile)

            // Create a preview URL for the selected image
            const reader = new FileReader()
            reader.onload = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const removePhoto = () => {
        setPhoto(null)
        setPhotoPreview(null)
    }

    const getCityAndCountry = (lat, lon) => {
        const apiKey = "8739517405194a86adfc82e0c169c068"; // Replace with your API key
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=en`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const location = data.results[0].components;
                    const city = location.city || location.town || location.village;
                    const country = location.country;
                    console.log(`City: ${city}, Country: ${country}`);
                    setFormData({
                        ...formData,
                        location: `${city}, ${country}`,
                    })
                } else {
                    console.log("Location not found.");
                }
            })
            .catch(() => console.log("Error fetching location data."));
    }

    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getCityAndCountry(latitude, longitude);
    }

    const error = () => {
        alert("Unable to retrieve your location.");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!actor || !photo) return;

        try {
            await actor.store_data(photo, formData.comment, formData.location);
            toastNotifications.success("Recycling data stored successfully!");
        } catch (error) {
            console.error("Failed to store data:", error);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-green-200">
            <div className="flex items-center gap-2 mb-6">
                <Recycle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-green-800">Submit Your Recycling Proof</h2>
            </div>

            {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">Thank you for your submission!</p>
                    <p className="text-green-600">Your recycling proof has been received.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-green-800">
                            Photo Proof of Recycling <span className="text-red-500">*</span>
                        </label>

                        {photoPreview ? (
                            <div className="relative">
                                <img
                                    src={photoPreview || "/placeholder.svg"}
                                    alt="Recycling proof preview"
                                    className="w-full h-64 object-cover rounded-lg border border-green-200"
                                />
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                                >
                                    <X className="h-5 w-5 text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Upload className="h-10 w-10 text-green-500" />
                                    <p className="text-sm text-green-800">Drag and drop your photo here, or click to browse</p>
                                    <p className="text-xs text-gray-500">JPG, PNG or GIF (Max. 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Location Input */}
                    <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium text-green-800">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-green-500" />
                            </div>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Where did you recycle?"
                                className="pl-10 w-full rounded-md border border-green-300 py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                            </div>
                            <span 
                                onClick={() => getUserLocation()}
                                className="text-xs cursor-pointer transition-all duration-300 hover:text-green-500 text-green-400 underline underline-offset-2 mt-3"
                            >
                                Determine location automatically.
                            </span>
                        </div>

                    {/* Comment Input */}
                    <div className="space-y-2">
                        <label htmlFor="comment" className="block text-sm font-medium text-green-800">
                            Comment
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <MessageSquare className="h-5 w-5 text-green-500" />
                            </div>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                placeholder="Share details about your recycling experience..."
                                rows={4}
                                className="pl-10 w-full rounded-md border border-green-300 py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !photo}
                        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${isSubmitting || !photo ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Recycling Proof"}
                    </button>
                </form>
            )}
        </div>
    )
}

export default RecyclingForm

