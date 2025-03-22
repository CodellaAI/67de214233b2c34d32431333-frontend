
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, MessageSquare, Send, AlertCircle } from 'lucide-react'

export default function NewTopicPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  })
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to create a topic')
      router.push('/login')
      return
    }
    
    setIsAuthenticated(true)
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/forums/categories`)
        setCategories(response.data)
        
        // Set default category if available
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data[0]._id }))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        toast.error('Failed to load forum categories. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [router])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please provide a title for your topic')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('Please provide content for your topic')
      return
    }
    
    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forums/topics`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      toast.success('Topic created successfully!')
      router.push(`/forums/topic/${response.data._id}`)
    } catch (err) {
      console.error('Error creating topic:', err)
      toast.error(err.response?.data?.message || 'Failed to create topic. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/forums" className="text-primary-600 hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Back to Forums
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h1 className="text-2xl font-bold flex items-center">
              <MessageSquare size={24} className="mr-2 text-primary-600" />
              Create a New Topic
            </h1>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input"
                  placeholder="Enter topic title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="input"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="12"
                  className="input"
                  placeholder="Write your topic content here..."
                  value={formData.content}
                  onChange={handleChange}
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  HTML formatting is supported. Be clear and descriptive to get the best responses.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please make sure your topic follows our community guidelines. Topics that violate our terms may be removed.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Link href="/forums" className="btn btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Create Topic
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
