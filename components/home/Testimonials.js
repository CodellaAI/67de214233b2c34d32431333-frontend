
import Image from 'next/image'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "This marketplace has been a game-changer for my server. I've found plugins that have completely transformed the player experience, and the support from developers is incredible.",
      author: "Alex Johnson",
      role: "Server Owner",
      avatar: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      content: "As a plugin developer, I've been able to reach so many more server owners and make a living doing what I love. The platform makes it easy to showcase my work and handle payments.",
      author: "Sarah Chen",
      role: "Plugin Developer",
      avatar: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      content: "The quality of plugins here is outstanding. I've tried other marketplaces but the review system and version control here ensures I always get reliable, well-maintained plugins.",
      author: "Michael Rodriguez",
      role: "Network Administrator",
      avatar: "https://via.placeholder.com/150"
    }
  ]
  
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">What Our Users Say</h2>
      <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        Join thousands of satisfied server owners and plugin developers who trust our marketplace
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute -top-4 left-6 bg-primary-600 text-white p-2 rounded-full">
              <Star size={20} fill="currentColor" />
            </div>
            
            <div className="mb-6 pt-2">
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{testimonial.author}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
