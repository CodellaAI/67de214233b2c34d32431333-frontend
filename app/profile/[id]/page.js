
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { User, Calendar, MapPin, Mail, Link as LinkIcon, Package, MessageSquare, Star } from 'lucide-react'
import PluginCard from '@/components/plugins/PluginCard'

export default function ProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [userPlugins, setUserPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('plugins')
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, pluginsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/user/${id}`)
        ])
        
        setUser(userRes.data)
        setUserPlugins(pluginsRes.data)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user profile. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [id])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'User not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        
        <div className="px-6 py-4 md:px-8 md:py-6 flex flex-col md:flex-row">
          <div className="flex-shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0 md:mr-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
              {user.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                  <User size={user.avatar ? 0 : 48} />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-gray-600">{user.title || 'Plugin Developer'}</p>
              </div>
              
              <div className="mt-2 md:mt-0 flex space-x-2">
                <Link href={`/messages/new?recipient=${user._id}`} className="btn btn-outline">
                  <Mail size={18} className="mr-1" />
                  Message
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap text-sm text-gray-600 gap-y-2">
              <div className="w-full md:w-auto flex items-center mr-6">
                <Calendar size={16} className="mr-1" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              {user.location && (
                <div className="w-full md:w-auto flex items-center mr-6">
                  <MapPin size={16} className="mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.website && (
                <div className="w-full md:w-auto flex items-center">
                  <LinkIcon size={16} className="mr-1" />
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
            
            {user.bio && (
              <div className="mt-4 text-gray-700">
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Plugins</p>
            <p className="text-2xl font-bold">{userPlugins.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Downloads</p>
            <p className="text-2xl font-bold">
              {userPlugins.reduce((total, plugin) => total + (plugin.downloads || 0), 0)}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Forum Posts</p>
            <p className="text-2xl font-bold">{user.postCount || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'plugins'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('plugins')}
            >
              Plugins
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'plugins' && (
            <>
              {userPlugins.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No plugins yet</h3>
                  <p className="text-gray-500">This user hasn't published any plugins yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPlugins.map(plugin => (
                    <PluginCard key={plugin._id} plugin={plugin} />
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'activity' && (
            <div className="text-center py-8">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Activity feed coming soon</h3>
              <p className="text-gray-500">We're working on this feature. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
