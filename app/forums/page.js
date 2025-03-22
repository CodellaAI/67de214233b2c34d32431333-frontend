
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, Plus, Clock, User, ChevronRight, Search } from 'lucide-react'

export default function ForumsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [recentTopics, setRecentTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const [categoriesRes, recentTopicsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/forums/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/forums/topics/recent`)
        ])
        
        setCategories(categoriesRes.data)
        setRecentTopics(recentTopicsRes.data)
      } catch (err) {
        console.error('Error fetching forum data:', err)
        setError('Failed to load forum data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchForumData()
  }, [])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/forums/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Forums</h1>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <form onSubmit={handleSearch} className="relative flex-grow">
            <input
              type="text"
              placeholder="Search forums..."
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
          
          <Link href="/forums/new-topic" className="btn btn-primary whitespace-nowrap flex items-center">
            <Plus size={18} className="mr-1" />
            New Topic
          </Link>
        </div>
      </div>
      
      {/* Forum Categories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div key={category._id} className="px-6 py-4">
              <Link href={`/forums/category/${category._id}`} className="flex justify-between items-center group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary-100 text-primary-600">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 space-x-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold">{category.topicCount || 0}</div>
                    <div className="text-xs uppercase">Topics</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-semibold">{category.postCount || 0}</div>
                    <div className="text-xs uppercase">Posts</div>
                  </div>
                  
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-primary-600" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Topics */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Recent Discussions</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentTopics.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <MessageSquare size={40} className="mx-auto mb-2 text-gray-400" />
              <p>No discussions yet. Be the first to start a topic!</p>
            </div>
          ) : (
            recentTopics.map((topic) => (
              <div key={topic._id} className="px-6 py-4 hover:bg-gray-50">
                <Link href={`/forums/topic/${topic._id}`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600">
                        {topic.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          <span>{topic.author.username}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {new Date(topic.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                            {topic.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xl font-semibold">{topic.replyCount || 0}</div>
                      <div className="text-xs uppercase text-gray-500">Replies</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
