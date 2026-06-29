import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import SEOHero from "../../components/seo/SEOHero";
import SEOContent from "../../components/seo/SEOContent";
import SEOCTA from "../../components/seo/SEOCTA";
import { BLOG_POSTS } from "../../data/blogPosts";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const [, setLocation] = useLocation();
  
  const post = BLOG_POSTS.find(p => p.id === params?.id);

  useEffect(() => {
    if (!post && params?.id) {
      setLocation("/blog");
    }
  }, [post, params, setLocation]);

  if (!post) return null;

  return (
    <>
      <SEO 
        title={`${post.title} | Roxten Studios Blog`}
        description={post.excerpt}
        canonicalUrl={`https://roxtenstudios.in/blog/${post.id}`}
        openGraph={{
          type: "article",
          image: post.image,
          article: {
            publishedTime: post.date,
            section: post.category
          }
        }}
      />
      <Navigation />
      <main className="pt-20 bg-[#030303]">
        <SEOHero 
          badge={`${post.category} • ${post.readTime}`}
          title={post.title}
          subtitle={post.date}
        />
        
        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-10 md:-mt-20 relative z-20">
          <div className="w-full aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <SEOContent>
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-white hover:prose-a:text-white/80 prose-strong:text-white prose-li:text-white/70">
            {post.content}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <Link href="/blog">
              <a className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                ← Back to Articles
              </a>
            </Link>
          </div>
        </SEOContent>

        <SEOCTA />
      </main>
      <Footer />
    </>
  );
}
