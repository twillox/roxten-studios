import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Link } from "wouter";
import { BLOG_POSTS } from "../../data/blogPosts";

export default function BlogIndex() {
  return (
    <>
      <SEO 
        title="Insights & Strategies for Digital Agencies | Roxten Studios Blog"
        description="Read our latest insights on scaling your agency, white-label partnerships, AI automation, and technical web development strategies."
        canonicalUrl="https://roxtenstudios.com/blog"
      />
      <Navigation />
      <main className="pt-32 pb-20 px-6 md:px-12 bg-[#050505] min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-black tracking-[-0.03em] text-white mb-6">
              Agency Insights <br className="hidden md:block" />& Strategies
            </h1>
            <p className="text-lg text-white/50 max-w-2xl">
              Actionable advice on scaling your agency, navigating white-label technical partnerships, and leveraging AI to dominate your market.
            </p>
          </header>

          {/* Search & Filter - Placeholder UI */}
          <div className="flex flex-col md:flex-row gap-4 mb-16">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Scaling', 'AI Automation', 'Web Development', 'Partnerships'].map(cat => (
                <button key={cat} className="whitespace-nowrap px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold tracking-wide">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          <div className="mb-16 md:mb-24">
            <Link href="/blog/how-to-scale-marketing-agency-without-developers">
              <a className="group block relative w-full rounded-[32px] overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-[#0a0a0a] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-6 block">Featured • Scaling</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                      How to Scale a Marketing Agency Without Hiring Full-Time Developers
                    </h2>
                    <p className="text-lg text-white/50 line-clamp-3 mb-8">
                      The traditional agency model of hiring in-house developers is fundamentally broken for most scaling agencies. Discover how transitioning to a white-label technical partner can drastically improve your margins and reduce operational risk.
                    </p>
                    <span className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                      Read Article <span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <a className="group flex flex-col h-full rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 overflow-hidden">
                  
                  {/* Card Image Header */}
                  <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#0a0a0a] border-b border-white/5">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0" 
                    />
                  </div>

                  <div className="flex flex-col flex-grow p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 group-hover:text-white transition-colors">
                        {post.category}
                      </span>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-8 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-white/30 font-mono uppercase tracking-widest border-t border-white/5 pt-4">
                      <span>{post.date}</span>
                      <span className="group-hover:translate-x-2 transition-transform duration-300 text-white/60 group-hover:text-white">Read →</span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
