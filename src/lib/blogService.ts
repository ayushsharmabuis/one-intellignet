import { 
  getFirestore, 
  collection, 
  doc,
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp, 
  limit, 
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { User } from "firebase/auth";

// Interface for the Blog type
export interface Blog {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageURL: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  publishDate: Timestamp | Date;
  lastModified?: Timestamp | Date;
  tags: string[];
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// Get Firestore instance
const db = getFirestore();
const storage = getStorage();

// Debug logs
console.log("Initializing blogService...");
console.log("Firestore instance created:", !!db);
console.log("Storage instance created:", !!storage);

// Collection reference
const blogsCollection = collection(db, "blogs");
console.log("Blogs collection reference created");

/**
 * Get all blogs
 * @param publishedOnly - Only return published blogs if true
 * @param limitCount - Number of blogs to return (optional)
 * @returns Array of blogs
 */
export const getBlogs = async (publishedOnly = true, limitCount?: number): Promise<Blog[]> => {
  try {
    let q = query(
      blogsCollection,
      publishedOnly ? where("published", "==", true) : where("published", "in", [true, false]),
      orderBy("publishDate", "desc")
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishDate: data.publishDate,
        lastModified: data.lastModified
      } as Blog;
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

/**
 * Get blog by ID
 * @param id - Blog ID
 * @returns Blog object or null if not found
 */
export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        publishDate: data.publishDate,
        lastModified: data.lastModified
      } as Blog;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
};

/**
 * Get blog by slug
 * @param slug - Blog slug
 * @returns Blog object or null if not found
 */
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const q = query(blogsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishDate: data.publishDate,
        lastModified: data.lastModified
      } as Blog;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};

/**
 * Create a slug from a title
 * @param title - Blog title
 * @returns Slugified string
 */
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
};

/**
 * Upload blog image to Firebase Storage
 * @param file - Image file to upload
 * @param blogId - Blog ID
 * @returns Download URL of the uploaded image
 */
export const uploadBlogImage = async (file: File, blogId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `blog-images/${blogId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading blog image:", error);
    throw error;
  }
};

/**
 * Delete blog image from Firebase Storage
 * @param imageURL - URL of the image to delete
 */
export const deleteBlogImage = async (imageURL: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting blog image:", error);
    throw error;
  }
};

/**
 * Add a new blog
 * @param blog - Blog object to add
 * @param user - Current user
 * @returns ID of the created blog
 */
export const addBlog = async (blog: Omit<Blog, 'id'>, user: User): Promise<string> => {
  try {
    const blogData = {
      ...blog,
      authorId: user.uid,
      authorName: user.displayName || "Admin",
      authorPhotoURL: user.photoURL || "",
      publishDate: serverTimestamp(),
      lastModified: serverTimestamp()
    };
    
    const docRef = await addDoc(blogsCollection, blogData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

/**
 * Update a blog
 * @param id - Blog ID
 * @param blogData - Updated blog data
 * @returns Success boolean
 */
export const updateBlog = async (id: string, blogData: Partial<Blog>): Promise<boolean> => {
  try {
    const blogRef = doc(db, "blogs", id);
    
    await updateDoc(blogRef, {
      ...blogData,
      lastModified: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating blog:", error);
    return false;
  }
};

/**
 * Delete a blog
 * @param id - Blog ID
 * @param imageURL - URL of the blog image to delete
 * @returns Success boolean
 */
export const deleteBlog = async (id: string, imageURL?: string): Promise<boolean> => {
  try {
    // Delete the image if provided
    if (imageURL) {
      try {
        await deleteBlogImage(imageURL);
      } catch (error) {
        console.warn("Failed to delete blog image, continuing with blog deletion", error);
      }
    }
    
    // Delete the blog document
    await deleteDoc(doc(db, "blogs", id));
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    return false;
  }
};

/**
 * Search blogs by title or content
 * @param searchTerm - Term to search for
 * @param publishedOnly - Only search published blogs if true
 * @returns Array of matching blogs
 */
export const searchBlogs = async (searchTerm: string, publishedOnly = true): Promise<Blog[]> => {
  try {
    // Get all blogs
    const blogs = await getBlogs(publishedOnly);
    
    // Filter locally since Firestore doesn't support text search
    const searchTermLower = searchTerm.toLowerCase();
    
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTermLower) ||
      blog.description.toLowerCase().includes(searchTermLower) ||
      blog.content.toLowerCase().includes(searchTermLower) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  } catch (error) {
    console.error("Error searching blogs:", error);
    return [];
  }
};

/**
 * Get blogs by tag
 * @param tag - Tag to filter by
 * @param publishedOnly - Only return published blogs if true
 * @returns Array of blogs with the specified tag
 */
export const getBlogsByTag = async (tag: string, publishedOnly = true): Promise<Blog[]> => {
  try {
    const q = query(
      blogsCollection,
      publishedOnly ? where("published", "==", true) : where("published", "in", [true, false]),
      where("tags", "array-contains", tag),
      orderBy("publishDate", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishDate: data.publishDate,
        lastModified: data.lastModified
      } as Blog;
    });
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    return [];
  }
};

/**
 * Get all available tags from published blogs
 * @returns Array of unique tags
 */
export const getAllTags = async (): Promise<string[]> => {
  try {
    const blogs = await getBlogs(true);
    const tagsSet = new Set<string>();
    
    blogs.forEach(blog => {
      blog.tags.forEach(tag => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

/**
 * Create a demo blog post for testing
 * @param user - Current authenticated user
 * @returns ID of the created blog
 */
export const createDemoBlogPost = async (user: User): Promise<string> => {
  try {
    const demoTags = ['AI', 'Machine Learning', 'Getting Started'];
    
    const demoBlog: Omit<Blog, 'id'> = {
      title: "Getting Started with AI Tools",
      slug: "getting-started-with-ai-tools",
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
      authorId: user.uid,
      authorName: user.displayName || "Admin",
      authorPhotoURL: user.photoURL || "",
      publishDate: new Date(),
      tags: demoTags,
      published: true,
      metaTitle: "Getting Started with AI Tools | One-Intelligent",
      metaDescription: "Learn how to effectively use AI tools to boost your productivity and creativity with this comprehensive guide.",
      metaKeywords: demoTags.join(', ')
    };
    
    const blogId = await addBlog(demoBlog, user);
    return blogId;
  } catch (error) {
    console.error("Error creating demo blog:", error);
    throw error;
  }
};

// Debug function to test Firestore connection
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing Firestore connection...");
    const testQuery = query(blogsCollection, limit(1));
    const querySnapshot = await getDocs(testQuery);
    console.log("Connection successful. Documents found:", querySnapshot.size);
    return true;
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    return false;
  }
}; 