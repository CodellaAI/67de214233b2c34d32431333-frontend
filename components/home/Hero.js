
import Link from 'next/link'
import { Search, Package, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 to-secondary-700 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
      <div className="relative container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            The Marketplace for Minecraft Plugin Developers
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover, buy, and sell high-quality Minecraft plugins. Join thousands of developers and server owners on the leading plugin marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/plugins" className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 flex items-center justify-center">
              <Search size={20} className="mr-2" />
              Browse Plugins
            </Link>
            <Link href="/plugins/create" className="btn bg-white/20 text-white hover:bg-white/30 px-6 py-3 flex items-center justify-center backdrop-blur-sm">
              <Package size={20} className="mr-2" />
              Sell Your Plugin
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="relative bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2,500+</div>
              <div className="text-white/80 text-sm">Plugins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10,000+</div>
              <div className="text-white/80 text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">250,000+</div>
              <div className="text-white/80 text-sm">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
