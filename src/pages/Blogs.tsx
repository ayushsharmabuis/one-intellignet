import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, Clock, Tag as TagIcon, ChevronRight, ChevronLeft, Plus, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { getBlogs, getAllTags, searchBlogs, getBlogsByTag, createDemoBlogPost, testFirestoreConnection, Blog } from '../lib/blogService';
import { useAuth } from '../lib/AuthContext';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { debugFirestoreConnection } from '../lib/firebase';

const Blogs: React.FC = () => {
  const { currentUser } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [creatingDemoBlog, setCreatingDemoBlog] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const blogsPerPage = 9;

  // Fetch blogs and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First debug the Firebase connection
        console.log("Debugging Firebase connection...");
        await debugFirestoreConnection();
        
        console.log("Testing Firestore connection...");
        const connectionTest = await testFirestoreConnection();
        console.log("Connection test result:", connectionTest);
        
        if (connectionTest) {
          console.log("Fetching blogs and tags...");
          const blogData = await getBlogs(true);
          const tagData = await getAllTags();
          
          console.log(`Fetched ${blogData.length} blogs and ${tagData.length} tags`);
          setBlogs(blogData);
          setFilteredBlogs(blogData);
          setAllTags(tagData);
        } else {
          console.error("Cannot fetch blogs due to connection issues");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      // If search is cleared, reset to all blogs or filtered by tag
      if (selectedTag) {
        const taggedBlogs = await getBlogsByTag(selectedTag);
        setFilteredBlogs(taggedBlogs);
      } else {
        setFilteredBlogs(blogs);
      }
    } else {
      // Search with the term
      const results = await searchBlogs(term);
      
      // Also apply tag filter if one is selected
      if (selectedTag) {
        setFilteredBlogs(results.filter(blog => blog.tags.includes(selectedTag)));
      } else {
        setFilteredBlogs(results);
      }
    }
    
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  // Handle tag selection
  const handleTagSelect = async (tag: string | null) => {
    setSelectedTag(tag);
    
    if (tag === null) {
      // If tag is cleared, reset to all blogs or search results
      if (searchTerm.trim() !== '') {
        const results = await searchBlogs(searchTerm);
        setFilteredBlogs(results);
      } else {
        setFilteredBlogs(blogs);
      }
    } else {
      // Filter by tag
      const taggedBlogs = await getBlogsByTag(tag);
      
      // Also apply search filter if one is active
      if (searchTerm.trim() !== '') {
        setFilteredBlogs(
          taggedBlogs.filter(blog => 
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredBlogs(taggedBlogs);
      }
    }
    
    // Reset to first page when tag filter changes
    setCurrentPage(1);
  };

  // Calculate pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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

  // Function to create a demo blog post
  const handleCreateDemoBlog = async () => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: 'You must be logged in to create a blog'
      });
      return;
    }
    
    try {
      setCreatingDemoBlog(true);
      
      console.log("Starting demo blog creation...");
      console.log("Current user:", currentUser.displayName || currentUser.email);
      
      // First test connection
      const connectionTest = await testFirestoreConnection();
      if (!connectionTest) {
        throw new Error("Firestore connection test failed. Cannot create blog.");
      }
      
      // Try using createDemoBlogPost first
      try {
        console.log("Using createDemoBlogPost function...");
        const blogId = await createDemoBlogPost(currentUser);
        console.log("Blog created successfully with ID:", blogId);
        
        // Refresh the blogs list
        const blogData = await getBlogs(true);
        setBlogs(blogData);
        setFilteredBlogs(blogData);
        
        setNotification({
          type: 'success',
          message: 'Demo blog created successfully!'
        });
        return;
      } catch (apiError) {
        console.error("Error using createDemoBlogPost:", apiError);
        console.log("Falling back to direct Firestore access...");
      }
      
      // Fallback: Create blog directly using Firestore
      const db = getFirestore();
      const blogsCollection = collection(db, "blogs");
      
      const demoTags = ['AI', 'Machine Learning', 'Getting Started'];
      const now = new Date();
      
      const demoBlog = {
        title: "Getting Started with AI Tools",
        slug: "getting-started-with-ai-tools-" + now.getTime().toString().slice(-4),
        description: "Learn how to effectively use AI tools to boost your productivity and creativity.",
        content: `
          <h2>Introduction to AI Tools</h2>
          <p>Artificial intelligence tools have revolutionized how we work and create. This blog post will guide you through the basics of getting started with AI tools.</p>
          
          <h2>Choosing the Right AI Tool</h2>
          <p>When selecting an AI tool, consider your specific needs and goals. Different tools excel at different tasks, from content creation to data analysis.</p>
          
          <h2>Best Practices</h2>
          <ul>
            <li>Start with clear prompts and instructions</li>
            <li>Review and refine AI-generated content</li>
            <li>Combine AI tools for better results</li>
            <li>Stay updated on new AI capabilities</li>
          </ul>
          
          <h2>Conclusion</h2>
          <p>AI tools can significantly enhance your workflow, but remember they're tools to augment your abilities, not replace your creativity and critical thinking.</p>
        `,
        imageURL: "https://images.unsplash.com/photo-1677442135622-1520627148ee?q=80&w=1932&auto=format&fit=crop",
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Admin",
        authorPhotoURL: currentUser.photoURL || "",
        publishDate: Timestamp.fromDate(now),
        lastModified: Timestamp.fromDate(now),
        tags: demoTags,
        published: true,
        metaTitle: "Getting Started with AI Tools | One-Intelligent",
        metaDescription: "Learn how to effectively use AI tools to boost your productivity and creativity with this comprehensive guide.",
        metaKeywords: demoTags.join(', ')
      };
      
      console.log("Adding blog directly to Firestore...");
      const docRef = await addDoc(blogsCollection, demoBlog);
      console.log("Blog created directly with ID:", docRef.id);
      
      // Refresh the blogs list
      const blogData = await getBlogs(true);
      setBlogs(blogData);
      setFilteredBlogs(blogData);
      
      setNotification({
        type: 'success',
        message: 'Demo blog created successfully using direct Firestore access!'
      });
    } catch (error) {
      console.error("Error creating demo blog:", error);
      setNotification({
        type: 'error',
        message: 'Failed to create demo blog: ' + (error.message || 'Unknown error')
      });
    } finally {
      setCreatingDemoBlog(false);
    }
  };

  return (
    <div className="min-h-screen bg-one-dark">
      <Helmet>
        <title>Blog | One-Intelligent</title>
        <meta name="description" content="Explore the latest articles and insights about AI tools and technologies." />
        <meta name="keywords" content="AI tools, artificial intelligence, blog, technology" />
        <meta property="og:title" content="Blog | One-Intelligent" />
        <meta property="og:description" content="Explore the latest articles and insights about AI tools and technologies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://one-intelligent.com/blogs" />
        <link rel="canonical" href="https://one-intelligent.com/blogs" />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Admin Tools Section - Only visible to authenticated users */}
        {currentUser && (
          <div className="mb-8">
            {notification && (
              <div className={`mb-4 p-4 rounded-lg ${
                notification.type === 'success' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {notification.message}
              </div>
            )}
            
            <div className="bg-one-card/30 backdrop-blur-sm border border-one-border/30 rounded-xl p-4">
              <h2 className="text-xl font-bold text-white mb-4">Admin Tools</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleCreateDemoBlog}
                  disabled={creatingDemoBlog}
                  className="px-4 py-2 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors flex items-center"
                >
                  {creatingDemoBlog ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2" size={18} />
                      Create Demo Blog
                    </>
                  )}
                </button>
                
                <Link
                  to="/admin/blogs"
                  className="px-4 py-2 bg-one-darker border border-one-border/30 text-one-text-muted rounded-lg hover:bg-one-dark hover:text-one-text transition-colors flex items-center"
                >
                  <Settings className="mr-2" size={18} />
                  Blog Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Our <span className="text-one-accent">Blog</span>
          </h1>
          <p className="text-one-text-muted text-lg max-w-2xl mx-auto">
            Discover the latest insights, tutorials and news about AI tools and technologies.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-10 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50 focus:bg-one-card/50"
              />
              <Search className="absolute left-3 top-3.5 text-one-text-muted" size={18} />
            </div>
            
            <div className="relative">
              <select
                value={selectedTag || ''}
                onChange={(e) => handleTagSelect(e.target.value === '' ? null : e.target.value)}
                className="appearance-none w-full px-4 py-3 pl-10 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50 focus:bg-one-card/50"
              >
                <option value="">All Topics</option>
                {allTags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-3.5 text-one-text-muted" size={18} />
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-one-accent"></div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl text-one-text mb-2">No blogs found</h3>
            <p className="text-one-text-muted">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
        
        {/* Blog Grid */}
        {!loading && filteredBlogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentBlogs.map((blog) => (
                <Link 
                  to={`/blogs/${blog.slug}`} 
                  key={blog.id}
                  className="group bg-one-card/30 backdrop-blur-sm border border-one-border/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-glow-sm hover:border-one-accent/30 hover:-translate-y-1"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={blog.imageURL} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 bg-one-accent/10 text-one-accent text-xs font-medium rounded"
                          onClick={(e) => {
                            e.preventDefault();
                            handleTagSelect(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-one-accent transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-one-text-muted mb-4 line-clamp-2">
                      {blog.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-one-text-muted">
                      <div className="flex items-center">
                        <User className="mr-1" size={14} />
                        <span>{blog.authorName}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="mr-1" size={14} />
                        <span>{formatPublishDate(blog.publishDate)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg mx-1 border border-one-border/30 bg-one-card/30 hover:bg-one-card/70 text-one-text disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-lg mx-1 ${
                      currentPage === i + 1
                        ? 'bg-one-accent text-white'
                        : 'border border-one-border/30 bg-one-card/30 hover:bg-one-card/70 text-one-text'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg mx-1 border border-one-border/30 bg-one-card/30 hover:bg-one-card/70 text-one-text disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
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

export default Blogs; 