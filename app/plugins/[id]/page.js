
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Star, Download, Clock, Tag, Users, Server, Calendar, ShoppingCart, ChevronDown, MessageSquare, Heart } from 'lucide-react'
import PluginVersionHistory from '@/components/plugins/PluginVersionHistory'
import PluginReviews from '@/components/plugins/PluginReviews'
import RelatedPlugins from '@/components/plugins/RelatedPlugins'

export default function PluginDetailsPage() {
  const { id } = useParams()
  const [plugin, setPlugin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('description')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    
    const fetchPluginDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`)
        setPlugin(response.data)
      } catch (err) {
        console.error('Error fetching plugin details:', err)
        setError('Failed to load plugin details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPluginDetails()
  }, [id])

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this plugin')
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/purchases`, 
        { pluginId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      toast.success('Plugin purchased successfully!')
    } catch (err) {
      console.error('Purchase error:', err)
      toast.error(err.response?.data?.message || 'Failed to purchase plugin. Please try again.')
    }
  }

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to download this plugin')
      return
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/download`,
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob'
        }
      )
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${plugin.name}.jar`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Download started!')
    } catch (err) {
      console.error('Download error:', err)
      toast.error(err.response?.data?.message || 'Failed to download plugin. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !plugin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Plugin not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Plugin Header */}
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="relative h-64 w-full md:w-64 md:h-64">
              <Image
                src={plugin.thumbnail || 'https://via.placeholder.com/300?text=Plugin+Image'}
                alt={plugin.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="p-8 w-full">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  {plugin.tags && plugin.tags.map(tag => (
                    <span key={tag} className="text-xs inline-block py-1 px-2 mr-2 rounded-full bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plugin.name}</h1>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Link href={`/profile/${plugin.author._id}`} className="font-medium text-primary-600 hover:underline">
                    {plugin.author.username}
                  </Link>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      {new Date(plugin.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-700">
                      {plugin.rating ? plugin.rating.toFixed(1) : 'No ratings'} 
                      {plugin.reviewCount ? ` (${plugin.reviewCount})` : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center mr-4">
                    <Download className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-gray-700">{plugin.downloads || 0} downloads</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Server className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-gray-700">
                      MC {plugin.supportedVersions ? plugin.supportedVersions.join(', ') : 'All versions'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="text-right mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plugin.price ? `$${plugin.price.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  {plugin.price > 0 ? (
                    <button
                      onClick={handlePurchase}
                      className="btn btn-primary flex items-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Purchase
                    </button>
                  ) : (
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary flex items-center"
                    >
                      <Download size={18} className="mr-2" />
                      Download
                    </button>
                  )}
                  
                  <button className="btn btn-outline">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-t border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'versions'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('versions')}
            >
              Version History
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">About this plugin</h2>
              <div dangerouslySetInnerHTML={{ __html: plugin.description }} />
              
              {plugin.contributors && plugin.contributors.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Users size={20} className="mr-2" />
                    Contributors
                  </h3>
                  <div className="flex flex-wrap">
                    {plugin.contributors.map(contributor => (
                      <Link
                        key={contributor._id}
                        href={`/profile/${contributor._id}`}
                        className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-800"
                      >
                        {contributor.username}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'versions' && (
            <PluginVersionHistory versions={plugin.versions || []} />
          )}
          
          {activeTab === 'reviews' && (
            <PluginReviews pluginId={plugin._id} />
          )}
        </div>
      </div>
      
      <RelatedPlugins currentPluginId={plugin._id} tags={plugin.tags} />
    </div>
  )
}
