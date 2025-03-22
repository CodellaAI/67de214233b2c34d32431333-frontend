
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import PluginCard from '@/components/plugins/PluginCard'
import { ArrowRight } from 'lucide-react'

export default function FeaturedPlugins() {
  const [plugins, setPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchFeaturedPlugins = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/featured`)
        setPlugins(response.data)
      } catch (error) {
        console.error('Error fetching featured plugins:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedPlugins()
  }, [])
  
  return (
    <section className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Plugins</h2>
        <Link href="/plugins" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
          View all
          <ArrowRight size={18} className="ml-1" />
        </Link>
      </div>
      
      {loading ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plugins.map(plugin => (
            <PluginCard key={plugin._id} plugin={plugin} />
          ))}
        </div>
      )}
    </section>
  )
}
