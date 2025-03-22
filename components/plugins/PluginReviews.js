
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Star, User, ThumbsUp, Flag, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PluginReviews({ pluginId }) {
  const router = useRouter()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [reviewContent, setReviewContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${pluginId}/reviews`)
        setReviews(response.data.reviews)
        setUserReview(response.data.userReview)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to load reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReviews()
  }, [pluginId])
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to leave a review')
      router.push('/login')
      return
    }
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${pluginId}/reviews`,
        { content: reviewContent, rating },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      // Update the reviews list
      if (userReview) {
        // Replace existing review
        setReviews(reviews.map(review => 
          review._id === response.data._id ? response.data : review
        ))
      } else {
        // Add new review to the top
        setReviews([response.data, ...reviews])
      }
      
      setUserReview(response.data)
      setReviewContent('')
      setRating(0)
      toast.success(userReview ? 'Review updated successfully' : 'Review posted successfully')
    } catch (err) {
      console.error('Error posting review:', err)
      toast.error(err.response?.data?.message || 'Failed to post review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to like a review')
      return
    }
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      // Update the like count in the UI
      setReviews(reviews.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            likeCount: (review.likeCount || 0) + 1,
            liked: true
          }
        }
        return review
      }))
    } catch (err) {
      console.error('Error liking review:', err)
      toast.error('Failed to like review. Please try again.')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      
      {/* Review Form */}
      {isAuthenticated && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">
            {userReview ? 'Update Your Review' : 'Write a Review'}
          </h3>
          
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-gray-300 hover:text-yellow-400 focus:outline-none p-1"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={24}
                      fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                      className={(hoverRating || rating) >= star ? 'text-yellow-400' : ''}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="reviewContent"
                rows="4"
                className="input"
                placeholder="Share your experience with this plugin..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    {userReview ? 'Update Review' : 'Post Review'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
          <p className="text-gray-500">Be the first to review this plugin!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User size={20} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="font-medium">{review.author.username}</div>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className="text-yellow-400"
                              fill={review.rating >= star ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className={`text-sm flex items-center ${review.liked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
                        onClick={() => handleLikeReview(review._id)}
                        disabled={review.liked}
                      >
                        <ThumbsUp size={14} className="mr-1" />
                        <span>{review.likeCount || 0}</span>
                      </button>
                      
                      <button className="text-sm flex items-center text-gray-500 hover:text-red-600">
                        <Flag size={14} className="mr-1" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-gray-700">
                    <p>{review.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="text-center bg-gray-50 rounded-lg p-6">
          <p className="mb-4 text-gray-600">You need to be logged in to leave a review.</p>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary"
          >
            Log In to Write a Review
          </button>
        </div>
      )}
    </div>
  )
}
