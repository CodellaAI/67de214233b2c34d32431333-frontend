
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import PluginCard from '@/components/plugins/PluginCard'

export default function RelatedPlugins({ currentPluginId, tags }) {
  const [plugins, setPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!tags || tags.length === 0) {
      setLoading(false)
      return
    }
    
    const fetchRelatedPlugins = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/related/${currentPluginId}?tags=${tags.join(',')}`
        )
        setPlugins(response.data)
      } catch (error) {
        console.error('Error fetching related plugins:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRelatedPlugins()
  }, [currentPluginId, tags])
  
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (plugins.length === 0) {
    return null
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plugins.map(plugin => (
          <PluginCard key={plugin._id} plugin={plugin} />
        ))}
      </div>
    </div>
  )
}
