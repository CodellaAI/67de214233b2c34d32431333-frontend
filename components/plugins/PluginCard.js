
import Link from 'next/link'
import Image from 'next/image'
import { Star, Download, Tag } from 'lucide-react'

export default function PluginCard({ plugin }) {
  return (
    <Link href={`/plugins/${plugin._id}`} className="card group">
      <div className="relative h-48 w-full">
        <Image
          src={plugin.thumbnail || 'https://via.placeholder.com/300?text=Plugin+Image'}
          alt={plugin.name}
          fill
          className="object-cover rounded-t-lg"
        />
        
        {plugin.price > 0 && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-sm">
            ${plugin.price.toFixed(2)}
          </div>
        )}
        
        {plugin.price === 0 && (
          <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium shadow-sm">
            Free
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {plugin.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {plugin.description.replace(/<[^>]*>?/gm, '').substring(0, 80)}...
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{plugin.rating ? plugin.rating.toFixed(1) : '0.0'}</span>
            <span className="mx-1">•</span>
            <Download className="h-4 w-4 mr-1" />
            <span>{plugin.downloads || 0}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {plugin.author && plugin.author.username ? `by ${plugin.author.username}` : ''}
          </div>
        </div>
        
        {plugin.tags && plugin.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap">
            {plugin.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-800 mr-1 mb-1 px-2 py-1 rounded-full flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {plugin.tags.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                +{plugin.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
