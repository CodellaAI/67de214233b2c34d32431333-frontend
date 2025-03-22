
import Hero from '@/components/home/Hero'
import FeaturedPlugins from '@/components/home/FeaturedPlugins'
import CategoryBrowser from '@/components/home/CategoryBrowser'
import LatestPlugins from '@/components/home/LatestPlugins'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      <Hero />
      <FeaturedPlugins />
      <CategoryBrowser />
      <LatestPlugins />
      <Testimonials />
      <CallToAction />
    </div>
  )
}
