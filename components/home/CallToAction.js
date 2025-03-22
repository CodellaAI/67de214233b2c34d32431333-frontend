
import Link from 'next/link'
import { ArrowRight, Package, Download } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-gradient-to-br from-primary-600 to-secondary-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-12 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to enhance your Minecraft server?
            </h2>
            <p className="text-white/90 text-lg max-w-xl">
              Join our community of developers and server owners. Find the perfect plugins or share your creations with the world.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/plugins"
              className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 flex items-center justify-center"
            >
              <Download size={20} className="mr-2" />
              Get Plugins
            </Link>
            <Link
              href="/plugins/create"
              className="btn bg-white/20 text-white hover:bg-white/30 px-6 py-3 flex items-center justify-center backdrop-blur-sm"
            >
              <Package size={20} className="mr-2" />
              Become a Seller
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
