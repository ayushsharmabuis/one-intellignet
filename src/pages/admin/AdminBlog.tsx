import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  Calendar, 
  Hash,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import * as Tabs from '@radix-ui/react-tabs';
import { useAuth } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import { 
  Blog, 
  getBlogs, 
  addBlog, 
  updateBlog, 
  deleteBlog, 
  createSlug, 
  uploadBlogImage 
} from '../../lib/blogService';

// Rich text editor (you might want to install a proper rich text editor like TinyMCE, CKEditor, or Quill)
// This is a simple placeholder
const SimpleRichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  return (
    <textarea
      className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50 min-h-[300px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your blog content here... (HTML supported)"
    />
  );
};

const AdminBlog: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImageURL, setExistingImageURL] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check admin status and fetch blogs on component mount
  useEffect(() => {
    // Redirect non-admin users to the home page
    if (!authLoading && !currentUser) {
      navigate('/', { replace: true });
      return;
    }
    
    const fetchBlogs = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          // Get all blogs (published and unpublished)
          const blogData = await getBlogs(false);
          setBlogs(blogData);
        } catch (error) {
          console.error("Error fetching blogs:", error);
          showNotification('error', 'Failed to load blogs');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBlogs();
  }, [currentUser, authLoading, navigate]);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Reset form state
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setSlug('');
    setTags('');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setIsPublished(true);
    setImageFile(null);
    setImagePreview('');
    setExistingImageURL('');
  };

  // Handle blog selection for editing
  const handleSelectBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setDescription(blog.description);
    setContent(blog.content);
    setSlug(blog.slug);
    setTags(blog.tags.join(', '));
    setMetaTitle(blog.metaTitle || '');
    setMetaDescription(blog.metaDescription || '');
    setMetaKeywords(blog.metaKeywords || '');
    setIsPublished(blog.published);
    setExistingImageURL(blog.imageURL);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle creating new blog
  const handleCreateNew = () => {
    resetForm();
    setSelectedBlog(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  // Handle canceling edit/create
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    resetForm();
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate slug from title
  const handleGenerateSlug = () => {
    if (title) {
      setSlug(createSlug(title));
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      showNotification('error', 'You must be logged in to perform this action');
      return;
    }
    
    if (!title || !description || !content) {
      showNotification('error', 'Title, description and content are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare tags array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Generate slug if not provided
      const blogSlug = slug || createSlug(title);
      
      if (isCreating) {
        // Handle image upload for new blog
        if (!imageFile) {
          showNotification('error', 'Please select an image for the blog');
          setLoading(false);
          return;
        }
        
        // Create new blog object
        const newBlog: Omit<Blog, 'id'> = {
          title,
          description,
          content,
          slug: blogSlug,
          imageURL: '', // Temporary, will be updated after upload
          authorId: currentUser.uid,
          authorName: currentUser.displayName || 'Admin',
          authorPhotoURL: currentUser.photoURL || '',
          publishDate: new Date(),
          tags: tagsArray,
          published: isPublished,
          metaTitle,
          metaDescription,
          metaKeywords
        };
        
        // Add blog to get an ID
        const blogId = await addBlog(newBlog, currentUser);
        
        // Upload image
        const imageURL = await uploadBlogImage(imageFile, blogId);
        
        // Update blog with image URL
        await updateBlog(blogId, { imageURL });
        
        showNotification('success', 'Blog created successfully');
      } else if (isEditing && selectedBlog) {
        // Update existing blog
        const updatedBlog: Partial<Blog> = {
          title,
          description,
          content,
          slug: blogSlug,
          tags: tagsArray,
          published: isPublished,
          metaTitle,
          metaDescription,
          metaKeywords
        };
        
        // Handle image update if a new image is selected
        if (imageFile) {
          const imageURL = await uploadBlogImage(imageFile, selectedBlog.id!);
          updatedBlog.imageURL = imageURL;
        }
        
        // Update blog
        await updateBlog(selectedBlog.id!, updatedBlog);
        
        showNotification('success', 'Blog updated successfully');
      }
      
      // Refresh blogs list
      const updatedBlogs = await getBlogs(false);
      setBlogs(updatedBlogs);
      
      // Reset form and state
      handleCancel();
    } catch (error) {
      console.error("Error saving blog:", error);
      showNotification('error', 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  // Handle blog deletion
  const handleDelete = async (id: string, imageURL: string) => {
    if (showDeleteConfirm !== id) {
      setShowDeleteConfirm(id);
      return;
    }
    
    try {
      setLoading(true);
      await deleteBlog(id, imageURL);
      
      // Refresh blogs list
      const updatedBlogs = await getBlogs(false);
      setBlogs(updatedBlogs);
      
      showNotification('success', 'Blog deleted successfully');
    } catch (error) {
      console.error("Error deleting blog:", error);
      showNotification('error', 'Failed to delete blog');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Format date for display
  const formatBlogDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    // Check if it's a Firestore Timestamp
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), 'MMM dd, yyyy');
    }
    
    // Handle Date objects or strings
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <div className="min-h-screen bg-one-dark">
      <Helmet>
        <title>Blog Admin | One-Intelligent</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors flex items-center"
            disabled={isCreating || isEditing}
          >
            <Plus className="mr-2" size={18} />
            Create New Blog
          </button>
        </div>
        
        {/* Notification */}
        {notification && (
          <div 
            className={`mb-6 px-4 py-3 rounded-lg flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="mr-2" size={18} />
            ) : (
              <AlertCircle className="mr-2" size={18} />
            )}
            {notification.message}
          </div>
        )}
        
        {/* Main content */}
        <div className="bg-one-card/30 backdrop-blur-sm border border-one-border/30 rounded-xl p-6">
          {(isCreating || isEditing) ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {isCreating ? 'Create New Blog' : 'Edit Blog'}
                </h2>
                
                <button
                  onClick={handleCancel}
                  className="text-one-text-muted hover:text-one-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <Tabs.Root defaultValue="tab1">
                  <Tabs.List className="flex space-x-1 rounded-xl bg-one-darker/30 p-1 mb-6">
                    <Tabs.Trigger
                      value="tab1"
                      className="w-full rounded-lg py-2.5 text-sm font-medium transition-all leading-5 data-[state=active]:bg-one-accent data-[state=active]:text-white data-[state=active]:shadow text-one-text-muted hover:bg-white/[0.12] hover:text-white"
                    >
                      Basic Info
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab2"
                      className="w-full rounded-lg py-2.5 text-sm font-medium transition-all leading-5 data-[state=active]:bg-one-accent data-[state=active]:text-white data-[state=active]:shadow text-one-text-muted hover:bg-white/[0.12] hover:text-white"
                    >
                      Content
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab3"
                      className="w-full rounded-lg py-2.5 text-sm font-medium transition-all leading-5 data-[state=active]:bg-one-accent data-[state=active]:text-white data-[state=active]:shadow text-one-text-muted hover:bg-white/[0.12] hover:text-white"
                    >
                      SEO
                    </Tabs.Trigger>
                  </Tabs.List>
                  
                  <Tabs.Content value="tab1">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-one-text mb-2">Blog Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                          placeholder="Enter blog title"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-grow">
                          <label className="block text-one-text mb-2">URL Slug</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              className="flex-grow px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                              placeholder="blog-post-url-slug"
                            />
                            <button
                              type="button"
                              onClick={handleGenerateSlug}
                              className="px-4 py-2 bg-one-darker border border-one-border/30 text-one-text-muted rounded-lg hover:bg-one-dark hover:text-one-text transition-colors"
                            >
                              Generate
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-one-text mb-2">Published</label>
                          <div className="relative w-[100px]">
                            <select
                              value={isPublished ? 'true' : 'false'}
                              onChange={(e) => setIsPublished(e.target.value === 'true')}
                              className="w-full appearance-none px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-one-text-muted pointer-events-none" size={16} />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-one-text mb-2">Short Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50 min-h-[100px]"
                          placeholder="Enter a short description"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-one-text mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                          placeholder="ai, tools, technology"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-one-text mb-2">Featured Image</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-one-border/50 rounded-lg py-6">
                          {(imagePreview || existingImageURL) ? (
                            <div className="w-full">
                              <img 
                                src={imagePreview || existingImageURL} 
                                alt="Preview" 
                                className="max-h-60 mx-auto mb-4 rounded-lg"
                              />
                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImageFile(null);
                                    setImagePreview('');
                                    if (!isEditing) setExistingImageURL('');
                                  }}
                                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="text-one-text-muted mb-2" size={40} />
                              <p className="text-one-text-muted mb-4">
                                Click to upload or drag and drop
                              </p>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-one-darker border border-one-border/30 text-one-text-muted rounded-lg hover:bg-one-dark hover:text-one-text transition-colors"
                              >
                                Select File
                              </button>
                            </>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </Tabs.Content>
                  
                  {/* Content Panel */}
                  <Tabs.Content value="tab2">
                    <div>
                      <label className="block text-one-text mb-2">Blog Content</label>
                      <SimpleRichTextEditor 
                        value={content} 
                        onChange={setContent} 
                      />
                      <p className="text-one-text-muted text-sm mt-2">
                        HTML formatting is supported. You can use headings (h2, h3), paragraphs, lists, etc.
                      </p>
                    </div>
                  </Tabs.Content>
                  
                  {/* SEO Panel */}
                  <Tabs.Content value="tab3">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-one-text mb-2">Meta Title</label>
                        <input
                          type="text"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                          placeholder="SEO Title (leave empty to use blog title)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-one-text mb-2">Meta Description</label>
                        <textarea
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50 min-h-[100px]"
                          placeholder="SEO Description (leave empty to use blog description)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-one-text mb-2">Meta Keywords</label>
                        <input
                          type="text"
                          value={metaKeywords}
                          onChange={(e) => setMetaKeywords(e.target.value)}
                          className="w-full px-4 py-3 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                          placeholder="SEO Keywords (leave empty to use tags)"
                        />
                      </div>
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-one-border/30 text-one-text-muted rounded-lg hover:bg-one-darker hover:text-one-text transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        Save Blog
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Search and filter for blogs */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-one-card/30 border border-one-border/30 rounded-lg text-one-text focus:outline-none focus:border-one-accent/50"
                  />
                  <Search className="absolute left-3 top-3.5 text-one-text-muted" size={18} />
                </div>
              </div>
              
              {/* Blogs list */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-one-accent"></div>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-one-text-muted mb-4">No blogs found</p>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 bg-one-accent text-white rounded-lg hover:bg-one-accent/90 transition-colors"
                  >
                    Create your first blog
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-one-border/30">
                        <th className="text-left py-4 px-4 text-one-text-muted font-medium">Title</th>
                        <th className="text-left py-4 px-4 text-one-text-muted font-medium">Date</th>
                        <th className="text-left py-4 px-4 text-one-text-muted font-medium">Status</th>
                        <th className="text-right py-4 px-4 text-one-text-muted font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map((blog) => (
                        <tr key={blog.id} className="border-b border-one-border/10 hover:bg-one-darker/30">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                <img 
                                  src={blog.imageURL} 
                                  alt={blog.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{blog.title}</h3>
                                <p className="text-one-text-muted text-sm truncate max-w-[300px]">
                                  {blog.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-one-text-muted">{formatBlogDate(blog.publishDate)}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              blog.published 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end space-x-2">
                              <a
                                href={`/blogs/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-one-text-muted hover:text-one-text bg-one-card/30 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye size={18} />
                              </a>
                              <button
                                onClick={() => handleSelectBlog(blog)}
                                className="p-2 text-one-text-muted hover:text-one-text bg-one-card/30 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(blog.id!, blog.imageURL)}
                                className={`p-2 rounded-lg transition-colors ${
                                  showDeleteConfirm === blog.id
                                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                    : 'text-one-text-muted hover:text-one-text bg-one-card/30'
                                }`}
                                title={showDeleteConfirm === blog.id ? 'Confirm Delete' : 'Delete'}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog; 
