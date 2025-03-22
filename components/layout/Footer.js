
import Link from 'next/link'
import { 
  Github, Twitter, Facebook, Mail, 
  Heart, Shield, HelpCircle 
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Minecraft Plugin Bazaar</h3>
            <p className="text-gray-400 mb-4">
              The marketplace for Minecraft plugin developers to share and sell their creations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/plugins" className="text-gray-400 hover:text-white">
                  Browse Plugins
                </Link>
              </li>
              <li>
                <Link href="/plugins/create" className="text-gray-400 hover:text-white">
                  Sell Your Plugin
                </Link>
              </li>
              <li>
                <Link href="/plugins?price=free" className="text-gray-400 hover:text-white">
                  Free Plugins
                </Link>
              </li>
              <li>
                <Link href="/plugins?sort=popular" className="text-gray-400 hover:text-white">
                  Popular Plugins
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/forums" className="text-gray-400 hover:text-white">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-gray-400 hover:text-white">
                  Discord Server
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Minecraft Plugin Bazaar. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm flex items-center">
              <Shield size={16} className="mr-1" />
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm flex items-center">
              <Shield size={16} className="mr-1" />
              Privacy
            </Link>
            <Link href="/help" className="text-gray-400 hover:text-white text-sm flex items-center">
              <HelpCircle size={16} className="mr-1" />
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
