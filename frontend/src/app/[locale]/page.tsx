import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import BookingSection from '@/components/sections/BookingSection'
import JobsPreview from '@/components/sections/JobsPreview'
import ToolsPreview from '@/components/sections/ToolsPreview'
import BlogPreview from '@/components/sections/BlogPreview'
import type { Profile } from '@/lib/types'

async function getProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/profile`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    return data.profile ?? null
  } catch {
    return null
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const profile = await getProfile()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <BookingSection />
        <JobsPreview />
        <ToolsPreview />
        <BlogPreview />
      </main>
      <Footer />
    </>
  )
}
