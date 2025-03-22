
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import PluginCard from '@/components/plugins/PluginCard'
import PluginFilters from '@/components/plugins/PluginFilters'
import { Search, Filter } from 'lucide-react'

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minecraftVersion: '',
    price: 'all', // 'all', 'free', 'paid'
    sortBy: 'newest' // 'newest', 'popular', 'price-low', 'price-high'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPlugins()
  }, [filters])

  const fetchPlugins = async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filters.category) params.append('category', filters.category)
      if (filters.minecraftVersion) params.append('minecraftVersion', filters.minecraftVersion)
      if (filters.price !== 'all') params.append('price', filters.price)
      params.append('sortBy', filters.sortBy)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins?${params}`)
      setPlugins(response.data)
    } catch (err) {
      console.error('Error fetching plugins:', err)
      setError('Failed to load plugins. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPlugins()
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Minecraft Plugins</h1>
        
        <div className="w-full md:w-auto flex items-center">
          <form onSubmit={handleSearch} className="relative flex-grow mr-2">
            <input
              type="text"
              placeholder="Search plugins..."
              className="input pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          </form>
          <button
            className="btn btn-outline flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-1" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
          <PluginFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : plugins.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded text-center">
              <h3 className="text-lg font-medium mb-2">No plugins found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => (
                <PluginCard key={plugin._id} plugin={plugin} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
