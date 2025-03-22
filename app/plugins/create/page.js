
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Upload, Tag, Plus, Trash2, Server, User, FileText, 
  Info, Loader, CheckCircle, AlertCircle 
} from 'lucide-react'

export default function CreatePluginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [jarFile, setJarFile] = useState(null)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [supportedVersions, setSupportedVersions] = useState([])
  const [contributors, setContributors] = useState([])
  const [contributorInput, setContributorInput] = useState('')
  const [searchingContributor, setSearchingContributor] = useState(false)
  const [contributorResults, setContributorResults] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm()

  // Minecraft versions for selection
  const minecraftVersions = [
    '1.20', '1.19', '1.18', '1.17', '1.16', '1.15', 
    '1.14', '1.13', '1.12', '1.11', '1.10', '1.9', '1.8', '1.7'
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to create a plugin')
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleJarFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.jar')) {
        toast.error('Only JAR files are allowed')
        e.target.value = null
        return
      }
      setJarFile(file)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const toggleVersion = (version) => {
    if (supportedVersions.includes(version)) {
      setSupportedVersions(supportedVersions.filter(v => v !== version))
    } else {
      setSupportedVersions([...supportedVersions, version])
    }
  }

  const searchContributors = async (username) => {
    if (username.trim().length < 2) {
      setContributorResults([])
      return
    }
    
    setSearchingContributor(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?username=${username}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      setContributorResults(response.data)
    } catch (error) {
      console.error('Error searching contributors:', error)
    } finally {
      setSearchingContributor(false)
    }
  }

  const addContributor = (contributor) => {
    if (!contributors.some(c => c._id === contributor._id)) {
      setContributors([...contributors, contributor])
      setContributorInput('')
      setContributorResults([])
    }
  }

  const removeContributor = (contributorId) => {
    setContributors(contributors.filter(c => c._id !== contributorId))
  }

  const onSubmit = async (data) => {
    if (!jarFile) {
      toast.error('Please upload a JAR file for your plugin')
      return
    }

    if (supportedVersions.length === 0) {
      toast.error('Please select at least one supported Minecraft version')
      return
    }

    setIsLoading(true)
    
    try {
      // Create form data for multipart upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price || 0)
      
      // Add tags
      tags.forEach(tag => {
        formData.append('tags', tag)
      })
      
      // Add supported versions
      supportedVersions.forEach(version => {
        formData.append('supportedVersions', version)
      })
      
      // Add contributors
      contributors.forEach(contributor => {
        formData.append('contributors', contributor._id)
      })
      
      // Add version info
      formData.append('versionNumber', data.versionNumber)
      formData.append('versionChangelog', data.versionChangelog)
      
      // Add files
      if (thumbnailPreview) {
        const thumbnailFile = document.getElementById('thumbnail').files[0]
        formData.append('thumbnail', thumbnailFile)
      }
      
      formData.append('jarFile', jarFile)
      
      // Submit the form
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      toast.success('Plugin created successfully!')
      router.push(`/plugins/${response.data._id}`)
    } catch (error) {
      console.error('Error creating plugin:', error)
      toast.error(error.response?.data?.message || 'Failed to create plugin. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Plugin</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Info size={20} className="mr-2 text-primary-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Plugin Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter plugin name"
                  {...register('name', { required: 'Plugin name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div className="col-span-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($ USD)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="0.00 (free)"
                  {...register('price')}
                />
                <p className="mt-1 text-xs text-gray-500">Leave at 0 for free plugins</p>
              </div>
              
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows="6"
                  className={`input ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe your plugin in detail. HTML is supported for formatting."
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Files Upload */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload size={20} className="mr-2 text-primary-600" />
              Plugin Files
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {thumbnailPreview ? (
                    <div className="space-y-1 text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Change image</span>
                          <input id="thumbnail" name="thumbnail" type="file" className="sr-only" onChange={handleThumbnailChange} accept="image/*" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload an image</span>
                          <input id="thumbnail" name="thumbnail" type="file" className="sr-only" onChange={handleThumbnailChange} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  JAR File *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {jarFile ? (
                      <div className="flex flex-col items-center">
                        <FileText size={48} className="text-primary-600" />
                        <p className="text-sm text-gray-600 mt-2">{jarFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(jarFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setJarFile(null)
                            document.getElementById('jarFile').value = ''
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-500"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="jarFile" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                            <span>Upload JAR file</span>
                            <input id="jarFile" name="jarFile" type="file" className="sr-only" onChange={handleJarFileChange} accept=".jar" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">Only .jar files are accepted</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Version Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag size={20} className="mr-2 text-primary-600" />
              Version Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label htmlFor="versionNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Version Number *
                </label>
                <input
                  id="versionNumber"
                  type="text"
                  className={`input ${errors.versionNumber ? 'border-red-500' : ''}`}
                  placeholder="e.g. 1.0.0"
                  {...register('versionNumber', { required: 'Version number is required' })}
                />
                {errors.versionNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.versionNumber.message}</p>
                )}
              </div>
              
              <div className="col-span-1">
                <label htmlFor="versionChangelog" className="block text-sm font-medium text-gray-700 mb-1">
                  Changelog
                </label>
                <textarea
                  id="versionChangelog"
                  rows="3"
                  className="input"
                  placeholder="What's new in this version?"
                  {...register('versionChangelog')}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag size={20} className="mr-2 text-primary-600" />
              Tags
            </h2>
            
            <div className="flex flex-wrap items-center mb-2">
              {tags.map((tag, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1 m-1"
                >
                  <span>{tag}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                className="input rounded-r-none"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-200"
                onClick={addTag}
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press Enter or click the plus button to add a tag
            </p>
          </div>
          
          {/* Supported Minecraft Versions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Server size={20} className="mr-2 text-primary-600" />
              Supported Minecraft Versions
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {minecraftVersions.map((version) => (
                <button
                  key={version}
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${
                    supportedVersions.includes(version)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleVersion(version)}
                >
                  {version}
                </button>
              ))}
            </div>
            {supportedVersions.length === 0 && (
              <p className="mt-2 text-sm text-red-600">
                Please select at least one supported Minecraft version
              </p>
            )}
          </div>
          
          {/* Contributors */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2 text-primary-600" />
              Contributors
            </h2>
            
            <div className="flex flex-wrap items-center mb-2">
              {contributors.map((contributor) => (
                <div 
                  key={contributor._id}
                  className="flex items-center bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1 m-1"
                >
                  <span>{contributor.username}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeContributor(contributor._id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  className="input rounded-r-none"
                  placeholder="Search for contributors by username"
                  value={contributorInput}
                  onChange={(e) => {
                    setContributorInput(e.target.value)
                    searchContributors(e.target.value)
                  }}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-200"
                  disabled={searchingContributor}
                >
                  {searchingContributor ? <Loader size={20} className="animate-spin" /> : <User size={20} />}
                </button>
              </div>
              
              {contributorResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {contributorResults.map(user => (
                    <button
                      key={user._id}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                      onClick={() => addContributor(user)}
                    >
                      <User size={16} className="mr-2 text-gray-500" />
                      {user.username}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Search for users to add as contributors to your plugin
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="btn btn-outline mr-4"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader size={20} className="animate-spin mr-2" />
                  Creating Plugin...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  Create Plugin
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
