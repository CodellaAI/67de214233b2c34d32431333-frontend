
import Link from 'next/link'
import { 
  Shield, Sword, Wand2, Users, Gavel, Heart, 
  Map, Ticket, Sparkles, Lightbulb, Package 
} from 'lucide-react'

export default function CategoryBrowser() {
  const categories = [
    { name: 'Admin Tools', icon: Shield, color: 'bg-red-100 text-red-600' },
    { name: 'Gameplay', icon: Sword, color: 'bg-blue-100 text-blue-600' },
    { name: 'Magic', icon: Wand2, color: 'bg-purple-100 text-purple-600' },
    { name: 'Economy', icon: Ticket, color: 'bg-green-100 text-green-600' },
    { name: 'Roleplay', icon: Users, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Moderation', icon: Gavel, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'World Management', icon: Map, color: 'bg-teal-100 text-teal-600' },
    { name: 'Cosmetics', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
    { name: 'Utilities', icon: Lightbulb, color: 'bg-amber-100 text-amber-600' },
    { name: 'Mini-Games', icon: Heart, color: 'bg-cyan-100 text-cyan-600' },
    { name: 'All Categories', icon: Package, color: 'bg-gray-100 text-gray-600' }
  ]
  
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/plugins?category=${encodeURIComponent(category.name)}`}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-full ${category.color} mb-3`}>
              <category.icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-900">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
