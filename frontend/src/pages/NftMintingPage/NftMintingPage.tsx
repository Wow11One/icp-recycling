import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import {
  Upload,
  X,
  Coffee,
  Gift,
  ShoppingBag,
  Leaf,
  Ticket,
  Award,
  Check,
} from "lucide-react";
import { createActor as createNftActor, canisterId as nftCanisterId } from 'declarations/nft';
import { AuthClient } from "@dfinity/auth-client";
import toastNotifications from "../../utils/toastNotifications.utils";
import { uploadFileToPinata, getFileUrl } from "../../utils/pinata.utils";
import { generateImageWithDeepAI } from "../../utils/deepAi.utils";

const nftTypes = [
  { id: "Shop", label: "Shop", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "Food/drinks", label: "Food/drinks", icon: <Coffee className="h-4 w-4" /> },
  { id: "Present", label: "Present", icon: <Gift className="h-4 w-4" /> },
  { id: "Environmental Impact", label: "Environmental Impact", icon: <Leaf className="h-4 w-4" /> },
  { id: "Experiences", label: "Experiences", icon: <Ticket className="h-4 w-4" /> },
]

const discountSizes = [
  { value: 3, label: "3% Discount" },
  { value: 5, label: "5% Discount" },
  { value: 10, label: "10% Discount" },
  { value: 15, label: "15% Discount" },
  { value: 20, label: "20% Discount" },
]

function NftMintingPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    discountSize: 0,
  })
  const [image, setImage] = useState<File | null>(null)
  const [aiImage, setAiImage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setImage(selectedFile)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)

      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  const generateImageWithAi = async () => {
    const prompt = `
      Generate image based on name "${formData.name}" and description "${formData.description}"
    `;
    const imageUrl = await generateImageWithDeepAI(prompt);
    setImagePreview(imageUrl);
    setAiImage(imageUrl)

    toastNotifications.info('AI image generated successfully!')
  };

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    setAiImage('')
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "NFT name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.type) {
      newErrors.type = "Please select an NFT type"
    }

    if (formData.type === "discount" && !formData.discountSize) {
      newErrors.discountSize = "Please select a discount size"
    }

    if (!image && !aiImage) {
      newErrors.image = "Please upload an image for your NFT"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()

      if (!validateForm()) {
        return
      }
      setIsSubmitting(true)

      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const actor = createNftActor(nftCanisterId, {
        agentOptions: {
          identity,
        },
      });

      let imageUrl = aiImage;
      if (image && !aiImage) {
        const uriIc = await uploadFileToPinata(image);
        imageUrl = getFileUrl(uriIc);
      }

      await actor.add_nft_template({
        id: crypto.randomUUID(),
        title: formData.name,
        description: formData.description,
        token_cost: 2500,
        image: imageUrl,
        category: formData.type,
        discount_size: 3,
        owner: identity.getPrincipal().toString(),
        business_id: '',
        created_at: new Date().getTime(),
      });

      toastNotifications.success("NFT template created successfully")
      setSubmitSuccess(true)

      setFormData({
        name: "",
        description: "",
        type: "",
        discountSize: 0,
      })
      setImage(null)
      setImagePreview(null)
      setSubmitSuccess(false)

    } catch (err) {
      toastNotifications.error(`Error occured while creating NFT template:${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-green-50'>
      <main className='container mx-auto py-12 px-4'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center gap-2 mb-2'>
            <Award className='h-6 w-6 text-green-600' />
            <h1 className='text-3xl font-bold text-green-800'>Create New NFT Reward</h1>
          </div>
          <p className='text-gray-600 mb-8'>
            Create a new NFT reward that users can redeem with their recycling tokens. Fill out the
            form below to mint a new NFT to the platform.
          </p>

          {submitSuccess ? (
            <div className='bg-green-50 border border-green-200 rounded-lg p-8 text-center'>
              <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4'>
                <Check className='h-8 w-8 text-green-600' />
              </div>
              <h2 className='text-2xl font-bold text-green-800 mb-2'>NFT Created Successfully!</h2>
              <p className='text-green-600 mb-6'>
                Your NFT has been minted and added to the rewards collection.
              </p>
              <div className='flex justify-center gap-4'>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className='px-4 py-2 bg-white border border-green-300 rounded-md text-green-600 hover:bg-green-50'
                >
                  Create Another NFT
                </button>
                <Link
                  to='/bonus-shop'
                  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
                >
                  View in Bonus Shop
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className='bg-white p-6 rounded-lg shadow-md border border-green-200'
            >
              <div className='mb-6'>
                <label htmlFor='name' className='block text-sm font-medium text-green-800 mb-1'>
                  NFT Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Enter a name for your NFT reward'
                  className={`w-full rounded-md border ${
                    errors.name ? 'border-red-300' : 'border-green-300'
                  } py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-green-800 mb-1'
                >
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Describe what this NFT reward offers to users'
                  rows={4}
                  className={`w-full rounded-md border ${
                    errors.description ? 'border-red-300' : 'border-green-300'
                  } py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-500'>{errors.description}</p>
                )}
              </div>

              <div className='mb-6'>
                <div className='flex items-center justify-between'>
                  <label className='block text-sm font-medium text-green-800 mb-1'>
                    NFT Image <span className='text-red-500'>*</span>
                  </label>
                </div>

                {imagePreview ? (
                  <div className='relative'>
                    <img
                      src={imagePreview || '/placeholder.svg'}
                      alt='NFT preview'
                      className='w-full h-64 object-cover rounded-lg border border-green-200'
                    />
                    <button
                      type='button'
                      onClick={removeImage}
                      className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50'
                    >
                      <X className='h-5 w-5 text-red-500' />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed ${
                      errors.image ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                    } rounded-lg p-6 text-center relative`}
                  >
                    <div className='flex flex-col items-center justify-center space-y-2'>
                      <Upload className='h-10 w-10 text-green-500' />
                      <p className='text-sm text-green-800'>
                        Drag and drop your image here, or click to browse
                      </p>
                      <p className='text-xs text-gray-500'>JPG, PNG or GIF (Max. 5MB)</p>
                    </div>
                    <input
                      type='file'
                      id='image'
                      name='image'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                  </div>
                )}
                {errors.image && <p className='mt-1 text-sm text-red-500'>{errors.image}</p>}
                  <span
                    onClick={() => generateImageWithAi()}
                    className='text-xs cursor-pointer transition-all duration-300 hover:text-green-500 text-green-400 underline underline-offset-2 mt-3'
                  >
                    Generate NFT image with Deep AI
                  </span>
              </div>


              {/* NFT Type */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-green-800 mb-1'>
                  NFT Type <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {nftTypes.map(type => (
                    <label
                      key={type.id}
                      className={`flex items-center gap-2 p-3 rounded-md border ${
                        formData.type === type.id
                          ? 'bg-green-100 border-green-400'
                          : 'bg-white border-gray-200 hover:bg-green-50'
                      } cursor-pointer transition-colors`}
                    >
                      <input
                        type='radio'
                        name='type'
                        value={type.id}
                        checked={formData.type === type.id}
                        onChange={handleInputChange}
                        className='sr-only'
                      />
                      <div className='flex items-center gap-2'>
                        {type.icon}
                        <span className='text-sm font-medium'>{type.label}</span>
                      </div>
                      {formData.type === type.id && (
                        <Check className='h-4 w-4 text-green-600 ml-auto' />
                      )}
                    </label>
                  ))}
                </div>
                {errors.type && <p className='mt-1 text-sm text-red-500'>{errors.type}</p>}
              </div>

              {/* Discount Size (only shown if type is "discount") */}
              {formData.type === 'discount' && (
                <div className='mb-6'>
                  <label
                    htmlFor='discountSize'
                    className='block text-sm font-medium text-green-800 mb-1'
                  >
                    Discount Size <span className='text-red-500'>*</span>
                  </label>
                  <select
                    id='discountSize'
                    name='discountSize'
                    value={formData.discountSize}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border ${
                      errors.discountSize ? 'border-red-300' : 'border-green-300'
                    } py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  >
                    <option value=''>Select discount percentage</option>
                    {discountSizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  {errors.discountSize && (
                    <p className='mt-1 text-sm text-red-500'>{errors.discountSize}</p>
                  )}
                </div>
              )}

              {/* Token Cost Info
              <div className='mb-6 bg-green-50 p-4 rounded-md border border-green-200'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <h3 className='text-sm font-medium text-green-800'>Token Cost</h3>
                    <p className='text-xs text-gray-600 mt-1'>
                      The token cost for this NFT will be automatically calculated based on the type
                      and value of the reward. Discounts and freebies typically cost between 50-150
                      tokens.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  isSubmitting
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                    <span>Creating NFT...</span>
                  </div>
                ) : (
                  'Create NFT'
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default NftMintingPage
