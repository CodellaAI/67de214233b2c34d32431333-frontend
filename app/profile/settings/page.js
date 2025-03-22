
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  User, Lock, Mail, MapPin, Globe, FileText, 
  Image as ImageIcon, Save, Loader, Trash2, 
  CreditCard, Bell, Shield, LogOut 
} from 'lucide-react'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile }, setValue } = useForm()
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword }, watch } = useForm()
  
  const newPassword = watch('newPassword', '')
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to access profile settings')
      router.push('/login')
      return
    }
    
    setIsAuthenticated(true)
    fetchUserProfile(token)
  }, [router])
  
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      setUser(response.data)
      
      // Set form values
      setValue('username', response.data.username)
      setValue('email', response.data.email)
      setValue('bio', response.data.bio || '')
      setValue('location', response.data.location || '')
      setValue('website', response.data.website || '')
      setValue('title', response.data.title || '')
      
      if (response.data.avatar) {
        setAvatarPreview(response.data.avatar)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      toast.error('Failed to load your profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const onProfileSubmit = async (data) => {
    setSavingProfile(true)
    
    try {
      const formData = new FormData()
      
      // Add profile data
      formData.append('username', data.username)
      formData.append('email', data.email)
      formData.append('bio', data.bio)
      formData.append('location', data.location)
      formData.append('website', data.website)
      formData.append('title', data.title)
      
      // Add avatar if changed
      const avatarFile = document.getElementById('avatar').files[0]
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      setUser(response.data)
      toast.success('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }
  
  const onPasswordSubmit = async (data) => {
    setSavingPassword(true)
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      )
      
      toast.success('Password updated successfully!')
      
      // Reset form
      document.getElementById('password-form').reset()
    } catch (err) {
      console.error('Error updating password:', err)
      toast.error(err.response?.data?.message || 'Failed to update password. Please try again.')
    } finally {
      setSavingPassword(false)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/')
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
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === 'profile' 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} className="mr-2" />
                Profile
              </button>
              
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === 'security' 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} className="mr-2" />
                Security
              </button>
              
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === 'payment' 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('payment')}
              >
                <CreditCard size={18} className="mr-2" />
                Payment Methods
              </button>
              
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === 'notifications' 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-2" />
                Notifications
              </button>
              
              <button
                className="w-full text-left px-4 py-2 rounded-md flex items-center text-sm text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmitProfile(onProfileSubmit)}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User size={40} className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <label htmlFor="avatar" className="btn btn-outline cursor-pointer flex items-center">
                          <ImageIcon size={18} className="mr-2" />
                          Change Picture
                          <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            className="sr-only"
                            onChange={handleAvatarChange}
                            accept="image/*"
                          />
                        </label>
                        {avatarPreview && (
                          <button
                            type="button"
                            className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                            onClick={() => {
                              setAvatarPreview(null)
                              document.getElementById('avatar').value = ''
                            }}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove Picture
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="username"
                          type="text"
                          className={`input pl-10 ${errorsProfile.username ? 'border-red-500' : ''}`}
                          {...registerProfile('username', { required: 'Username is required' })}
                        />
                      </div>
                      {errorsProfile.username && (
                        <p className="mt-1 text-sm text-red-600">{errorsProfile.username.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className={`input pl-10 ${errorsProfile.email ? 'border-red-500' : ''}`}
                          {...registerProfile('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                      </div>
                      {errorsProfile.email && (
                        <p className="mt-1 text-sm text-red-600">{errorsProfile.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title / Role
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="input"
                        placeholder="e.g. Plugin Developer, Server Owner"
                        {...registerProfile('title')}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="location"
                          type="text"
                          className="input pl-10"
                          placeholder="City, Country"
                          {...registerProfile('location')}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="website"
                          type="url"
                          className="input pl-10"
                          placeholder="https://yourwebsite.com"
                          {...registerProfile('website')}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText size={18} className="text-gray-400" />
                        </div>
                        <textarea
                          id="bio"
                          rows="4"
                          className="input pl-10"
                          placeholder="Tell us about yourself..."
                          {...registerProfile('bio')}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn btn-primary flex items-center"
                    >
                      {savingProfile ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </div>
              
              <div className="p-6">
                <form id="password-form" onSubmit={handleSubmitPassword(onPasswordSubmit)}>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="currentPassword"
                          type="password"
                          className={`input pl-10 ${errorsPassword.currentPassword ? 'border-red-500' : ''}`}
                          {...registerPassword('currentPassword', { required: 'Current password is required' })}
                        />
                      </div>
                      {errorsPassword.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errorsPassword.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          type="password"
                          className={`input pl-10 ${errorsPassword.newPassword ? 'border-red-500' : ''}`}
                          {...registerPassword('newPassword', { 
                            required: 'New password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            }
                          })}
                        />
                      </div>
                      {errorsPassword.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errorsPassword.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          className={`input pl-10 ${errorsPassword.confirmPassword ? 'border-red-500' : ''}`}
                          {...registerPassword('confirmPassword', { 
                            required: 'Please confirm your new password',
                            validate: value => value === newPassword || 'Passwords do not match'
                          })}
                        />
                      </div>
                      {errorsPassword.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errorsPassword.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="btn btn-primary flex items-center"
                    >
                      {savingPassword ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield size={18} className="mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <hr className="my-8" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button className="btn btn-outline">
                    Set Up Two-Factor Authentication
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Methods */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
              </div>
              
              <div className="p-6">
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Payment methods coming soon</h3>
                  <p className="text-gray-500">We're working on this feature. Check back later!</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
              
              <div className="p-6">
                <div className="text-center py-8">
                  <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Notification settings coming soon</h3>
                  <p className="text-gray-500">We're working on this feature. Check back later!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
