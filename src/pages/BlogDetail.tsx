import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag as TagIcon, Share2, ChevronRight, Twitter, Linkedin, Facebook } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getBlogBySlug, getBlogById, Blog, getBlogs } from '../lib/blogService';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let blogData: Blog | null = null;
        
        // Try to fetch by slug first
        if (slug) {
          if (slug.includes('-')) {
            // It's likely a slug
            blogData = await getBlogBySlug(slug);
          } else {
            // It might be an ID
            blogData = await getBlogById(slug);
          }
        }
        
        if (blogData) {
          setBlog(blogData);
          document.title = `${blogData.title} | One-Intelligent Blog`;
          
          // Fetch related blogs (blogs with similar tags)
          if (blogData.tags && blogData.tags.length > 0) {
            const allBlogs = await getBlogs(true);
            const filteredRelatedBlogs = allBlogs
              .filter(b => 
                b.id !== blogData?.id && 
                b.tags.some(tag => blogData?.tags.includes(tag))
              )
              .slice(0, 3);
            
            setRelatedBlogs(filteredRelatedBlogs);
          }
        } else {
          setError("Blog not found");
          navigate("/blogs", { replace: true });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug, navigate]);
  
  // Format date for display
  const formatPublishDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    // Check if it's a Firestore Timestamp
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), 'MMMM dd, yyyy');
    }
    
    // Handle Date objects or strings
    return format(new Date(date), 'MMMM dd, yyyy');
  };
  
  // Generate share URLs
  const getShareUrl = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title || 'Blog post');
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
    }
  };
  
  // Handle share button click
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  return (
    <div className="min-h-screen bg-one-dark">
      {blog && (
        <Helmet>
          <title>{blog.metaTitle || blog.title} | One-Intelligent Blog</title>
          <meta name="description" content={blog.metaDescription || blog.description} />
          <meta name="keywords" content={blog.metaKeywords || blog.tags.join(', ')} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:title" content={blog.title} />
          <meta property="og:description" content={blog.description} />
          <meta property="og:image" content={blog.imageURL} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={window.location.href} />
          <meta property="article:published_time" content={blog.publishDate.toString()} />
          <meta property="article:author" content={blog.authorName} />
          {blog.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blog.title} />
          <meta name="twitter:description" content={blog.description} />
          <meta name="twitter:image" content={blog.imageURL} />
          
          {/* Canonical URL */}
          <link rel="canonical" href={`https://one-intelligent.com/blogs/${blog.slug}`} />
          
          {/* JSON-LD Structured Data for Blog Post */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": blog.title,
              "image": [blog.imageURL],
              "datePublished": blog.publishDate.toString(),
              "dateModified": blog.lastModified ? blog.lastModified.toString() : blog.publishDate.toString(),
              "author": {
                "@type": "Person",
                "name": blog.authorName
              },
              "publisher": {
                "@type": "Organization",
                "name": "One-Intelligent",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://one-intelligent.com/logo.png"
                }
              },
              "description": blog.description,
              "keywords": blog.tags.join(', '),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
              }
            })}
          </script>
        </Helmet>
      )}
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Back to blogs link */}
        <div className="mb-8">
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-one-text-muted hover:text-one-accent transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to all blogs
          </Link>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-one-accent"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-24">
            <h2 className="text-2xl text-one-text mb-4">{error}</h2>
            <Link 
              to="/blogs" 
              className="px-6 py-2 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors"
            >
              Return to blogs
            </Link>
          </div>
        )}
        
        {/* Blog Content */}
        {blog && !loading && !error && (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="mb-10">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blogs?tag=${tag}`}
                    className="inline-block px-3 py-1 bg-one-accent/10 text-one-accent text-sm font-medium rounded-full hover:bg-one-accent/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {blog.title}
              </h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-one-text-muted mb-8">
                <div className="flex items-center">
                  <User className="mr-1" size={16} />
                  <span>{blog.authorName}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="mr-1" size={16} />
                  <span>{formatPublishDate(blog.publishDate)}</span>
                </div>
                
                {/* Share Button */}
                <div className="relative ml-auto">
                  <button 
                    onClick={handleShare}
                    className="flex items-center px-3 py-1 bg-one-card/30 hover:bg-one-card/50 rounded-full transition-colors"
                  >
                    <Share2 className="mr-1" size={16} />
                    <span>Share</span>
                  </button>
                  
                  {/* Share Options */}
                  {showShareOptions && (
                    <div className="absolute right-0 top-full mt-2 p-2 bg-one-card/90 backdrop-blur-sm border border-one-border/30 rounded-lg shadow-lg z-10">
                      <div className="flex gap-2">
                        <a 
                          href={getShareUrl('twitter')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-one-text-muted hover:text-one-accent transition-colors"
                        >
                          <Twitter size={18} />
                        </a>
                        <a 
                          href={getShareUrl('facebook')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-one-text-muted hover:text-one-accent transition-colors"
                        >
                          <Facebook size={18} />
                        </a>
                        <a 
                          href={getShareUrl('linkedin')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-one-text-muted hover:text-one-accent transition-colors"
                        >
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Featured Image */}
              <div className="rounded-xl overflow-hidden mb-10">
                <img 
                  src={blog.imageURL} 
                  alt={blog.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Blog Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-16">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
            
            {/* Author Section */}
            <div className="mb-16 p-6 bg-one-card/30 backdrop-blur-sm border border-one-border/30 rounded-xl">
              <div className="flex items-center">
                {blog.authorPhotoURL ? (
                  <img 
                    src={blog.authorPhotoURL} 
                    alt={blog.authorName} 
                    className="w-14 h-14 rounded-full border-2 border-one-accent mr-4"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-one-accent/20 flex items-center justify-center mr-4">
                    <User size={24} className="text-one-accent" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-bold text-white">About {blog.authorName}</h3>
                  <p className="text-one-text-muted">
                    Content creator at One-Intelligent
                  </p>
                </div>
              </div>
            </div>
            
            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="border-t border-one-border/20 pt-12">
                <h2 className="text-2xl font-bold mb-8 text-white">Related Articles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link 
                      to={`/blogs/${relatedBlog.slug}`} 
                      key={relatedBlog.id}
                      className="group bg-one-card/30 backdrop-blur-sm border border-one-border/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-sm hover:border-one-accent/30"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedBlog.imageURL} 
                          alt={relatedBlog.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-one-accent transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        
                        <p className="text-one-text-muted text-sm mb-4 line-clamp-2">
                          {relatedBlog.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-one-text-muted">
                          <span>{formatPublishDate(relatedBlog.publishDate)}</span>
                          
                          <span className="flex items-center text-one-accent">
                            Read more
                            <ChevronRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center text-one-text-muted border-t border-one-border/20">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} One-Intelligent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail; 