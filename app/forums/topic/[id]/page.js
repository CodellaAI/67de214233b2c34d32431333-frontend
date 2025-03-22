
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MessageSquare, User, Clock, Reply, ThumbsUp, Flag, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function TopicPage() {
  const { id } = useParams()
  const router = useRouter()
  const [topic, setTopic] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    
    const fetchTopicData = async () => {
      try {
        const [topicRes, repliesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/forums/topics/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/forums/topics/${id}/replies`)
        ])
        
        setTopic(topicRes.data)
        setReplies(repliesRes.data)
      } catch (err) {
        console.error('Error fetching topic data:', err)
        setError('Failed to load topic. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopicData()
  }, [id])
  
  const handleReplySubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to reply')
      router.push('/login')
      return
    }
    
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forums/topics/${id}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      setReplies([...replies, response.data])
      setReplyContent('')
      toast.success('Reply posted successfully')
    } catch (err) {
      console.error('Error posting reply:', err)
      toast.error(err.response?.data?.message || 'Failed to post reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleLikeReply = async (replyId) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to like a reply')
      return
    }
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forums/replies/${replyId}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      // Update the like count in the UI
      setReplies(replies.map(reply => {
        if (reply._id === replyId) {
          return {
            ...reply,
            likeCount: reply.likeCount + 1,
            liked: true
          }
        }
        return reply
      }))
    } catch (err) {
      console.error('Error liking reply:', err)
      toast.error('Failed to like reply. Please try again.')
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error || !topic) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Topic not found'}
        </div>
        <div className="mt-4">
          <Link href="/forums" className="text-primary-600 hover:underline flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Forums
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/forums" className="text-primary-600 hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Back to Forums
        </Link>
      </div>
      
      {/* Topic Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            
            <div className="flex items-center space-x-3 text-sm text-gray-500">
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
        </div>
        
        {/* Original Post */}
        <div className="p-6">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <User size={24} />
              </div>
              <div className="mt-2 text-center text-xs font-medium text-gray-700">
                {topic.author.username}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: topic.content }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Replies ({replies.length})
        </h2>
        
        {replies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            <MessageSquare size={40} className="mx-auto mb-2 text-gray-400" />
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <User size={24} />
                      </div>
                      <div className="mt-2 text-center text-xs font-medium text-gray-700">
                        {reply.author.username}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            className={`text-sm flex items-center ${reply.liked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
                            onClick={() => handleLikeReply(reply._id)}
                            disabled={reply.liked}
                          >
                            <ThumbsUp size={14} className="mr-1" />
                            <span>{reply.likeCount || 0}</span>
                          </button>
                          
                          <button className="text-sm flex items-center text-gray-500 hover:text-red-600">
                            <Flag size={14} className="mr-1" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Reply size={18} className="mr-2" />
            Post a Reply
          </h2>
        </div>
        
        <div className="p-6">
          {isAuthenticated ? (
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <textarea
                  rows="5"
                  className="input"
                  placeholder="Write your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  HTML formatting is supported. Be respectful and follow community guidelines.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 text-gray-600">You need to be logged in to reply to this topic.</p>
              <Link href="/login" className="btn btn-primary">
                Log In to Reply
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
