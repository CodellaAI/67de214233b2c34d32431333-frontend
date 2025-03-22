
import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'

export default function PluginFilters({ filters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    versions: true,
    price: true,
    sort: true
  })
  
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    })
  }
  
  const categories = [
    'Admin Tools',
    'Gameplay',
    'Magic',
    'Economy',
    'Roleplay',
    'Moderation',
    'World Management',
    'Cosmetics',
    'Utilities',
    'Mini-Games'
  ]
  
  const minecraftVersions = [
    '1.20', '1.19', '1.18', '1.17', '1.16', 
    '1.15', '1.14', '1.13', '1.12', '1.11', 
    '1.10', '1.9', '1.8', '1.7'
  ]
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h3>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-medium mb-2"
            onClick={() => toggleSection('categories')}
          >
            Categories
            {expandedSections.categories ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-2 ml-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="category-all"
                  name="category"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={!filters.category}
                  onChange={() => onFilterChange({ category: '' })}
                />
                <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
                  All Categories
                </label>
              </div>
              
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={`category-${category}`}
                    name="category"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={filters.category === category}
                    onChange={() => onFilterChange({ category })}
                  />
                  <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Minecraft Versions */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-medium mb-2"
            onClick={() => toggleSection('versions')}
          >
            Minecraft Version
            {expandedSections.versions ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {expandedSections.versions && (
            <div className="space-y-2 ml-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="version-all"
                  name="minecraftVersion"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={!filters.minecraftVersion}
                  onChange={() => onFilterChange({ minecraftVersion: '' })}
                />
                <label htmlFor="version-all" className="ml-2 text-sm text-gray-700">
                  All Versions
                </label>
              </div>
              
              {minecraftVersions.map((version) => (
                <div key={version} className="flex items-center">
                  <input
                    type="radio"
                    id={`version-${version}`}
                    name="minecraftVersion"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={filters.minecraftVersion === version}
                    onChange={() => onFilterChange({ minecraftVersion: version })}
                  />
                  <label htmlFor={`version-${version}`} className="ml-2 text-sm text-gray-700">
                    {version}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Price */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-medium mb-2"
            onClick={() => toggleSection('price')}
          >
            Price
            {expandedSections.price ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-2 ml-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="price-all"
                  name="price"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.price === 'all'}
                  onChange={() => onFilterChange({ price: 'all' })}
                />
                <label htmlFor="price-all" className="ml-2 text-sm text-gray-700">
                  All Plugins
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="price-free"
                  name="price"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.price === 'free'}
                  onChange={() => onFilterChange({ price: 'free' })}
                />
                <label htmlFor="price-free" className="ml-2 text-sm text-gray-700">
                  Free
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="price-paid"
                  name="price"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.price === 'paid'}
                  onChange={() => onFilterChange({ price: 'paid' })}
                />
                <label htmlFor="price-paid" className="ml-2 text-sm text-gray-700">
                  Paid
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Sort By */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-medium mb-2"
            onClick={() => toggleSection('sort')}
          >
            Sort By
            {expandedSections.sort ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {expandedSections.sort && (
            <div className="space-y-2 ml-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-newest"
                  name="sortBy"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.sortBy === 'newest'}
                  onChange={() => onFilterChange({ sortBy: 'newest' })}
                />
                <label htmlFor="sort-newest" className="ml-2 text-sm text-gray-700">
                  Newest
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-popular"
                  name="sortBy"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.sortBy === 'popular'}
                  onChange={() => onFilterChange({ sortBy: 'popular' })}
                />
                <label htmlFor="sort-popular" className="ml-2 text-sm text-gray-700">
                  Most Popular
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-price-low"
                  name="sortBy"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.sortBy === 'price-low'}
                  onChange={() => onFilterChange({ sortBy: 'price-low' })}
                />
                <label htmlFor="sort-price-low" className="ml-2 text-sm text-gray-700">
                  Price: Low to High
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-price-high"
                  name="sortBy"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.sortBy === 'price-high'}
                  onChange={() => onFilterChange({ sortBy: 'price-high' })}
                />
                <label htmlFor="sort-price-high" className="ml-2 text-sm text-gray-700">
                  Price: High to Low
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sort-rating"
                  name="sortBy"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={filters.sortBy === 'rating'}
                  onChange={() => onFilterChange({ sortBy: 'rating' })}
                />
                <label htmlFor="sort-rating" className="ml-2 text-sm text-gray-700">
                  Highest Rated
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t">
        <button
          className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
          onClick={() => onFilterChange({
            category: '',
            minecraftVersion: '',
            price: 'all',
            sortBy: 'newest'
          })}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
