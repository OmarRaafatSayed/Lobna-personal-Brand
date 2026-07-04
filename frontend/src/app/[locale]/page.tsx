'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import BookingSection from '@/components/sections/BookingSection'
import JobsPreview from '@/components/sections/JobsPreview'
import ToolsPreview from '@/components/sections/ToolsPreview'
import BlogPreview from '@/components/sections/BlogPreview'
import api from '@/lib/api'
import type { Profile } from '@/lib/types'

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    api.get<{ profile: Profile }>('/profile')
      .then(res => setProfile(res.profile))
      .catch(() => setProfile(null))
  }, [])

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
