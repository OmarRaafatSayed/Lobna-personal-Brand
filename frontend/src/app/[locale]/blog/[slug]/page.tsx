import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Clock, ArrowRight, Tag } from 'lucide-react'
import type { BlogPost } from '@/lib/types'

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/blog/${slug}`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    return data.post ?? null
  } catch {
    return null
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-grad-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-5xl text-white mb-4">Post not found</h1>
            <Link href="/blog" className="text-rose hover:underline">← Back to Blog</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">

        {/* Cover hero */}
        {post.coverImage ? (
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
            <div className="absolute bottom-8 inset-x-0 container">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-rose text-sm mb-4 transition-colors">
                <ArrowRight size={15} /> Back to Blog
              </Link>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-rose/20 text-rose px-3 py-1 rounded-full border border-rose/30 flex items-center gap-1">
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-white leading-tight">{post.title}</h1>
            </div>
          </div>
        ) : (
          <div className="bg-grad-dark pt-32 pb-12">
            <div className="wrap">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-rose text-sm mb-6 transition-colors">
                <ArrowRight size={15} /> Back to Blog
              </Link>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-rose/15 text-rose px-3 py-1 rounded-full border border-rose/25">#{tag}</span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-white leading-tight">{post.title}</h1>
            </div>
          </div>
        )}

        {/* Article body */}
        <article className="wrap py-12 max-w-3xl">
          {/* Meta */}
          <div className="flex items-center gap-5 text-dark/40 text-sm mb-10 pb-8 border-b border-dark/8">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />{post.readTime} min read
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-dark/70 leading-[1.9] font-body
              prose-headings:font-display prose-headings:text-dark
              prose-p:text-dark/65 prose-p:leading-[1.9]
              prose-strong:text-dark prose-strong:font-bold
              prose-a:text-rose prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />

          {/* CTA Card */}
          <div className="mt-16 bg-grad-dark rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-rose/10 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <h3 className="font-display text-3xl text-white mb-3">Need Personal Help?</h3>
              <p className="text-white/55 mb-8 max-w-md mx-auto">
                Book a private consultation with me and we&apos;ll discuss your situation in detail and build a clear roadmap for your career.
              </p>
              <Link href="/#booking" className="btn-primary text-base py-4 px-10">
                Book Now ✨
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
