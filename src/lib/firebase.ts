// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
let db;
let auth;

try {
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable persistent auth state
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("✅ Firebase persistence set to LOCAL successfully");
    })
    .catch((error) => {
      console.error("❌ Error setting persistence:", error);
    });
    
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// User profile functions
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: any;
  lastLogin?: any;
  isNewUser?: boolean;
}

// Store user profile in Firestore
export const storeUserProfile = async (user: User, isNewUser: boolean = true): Promise<boolean> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: isNewUser ? serverTimestamp() : undefined,
      lastLogin: serverTimestamp(),
      isNewUser: isNewUser
    };

    // Using set with merge to update existing data if the user already exists
    await setDoc(doc(db, "users", user.uid), userProfile, { merge: true });
    return true;
  } catch (error) {
    console.error("Error storing user profile:", error);
    return false;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Check if a user is a new user
export const isNewUser = async (uid: string): Promise<boolean> => {
  const profile = await getUserProfile(uid);
  return !profile || profile.isNewUser === true;
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Don't wait for Firestore operation to complete before returning the user
    // Just queue it up to happen in the background
    const profilePromise = getUserProfile(result.user.uid).then(profile => {
      const isFirstTimeUser = !profile;
      storeUserProfile(result.user, isFirstTimeUser);
      return isFirstTimeUser;
    });
    
    // Return immediately with the user, allowing the auth to complete faster
    return { 
      success: true, 
      user: result.user,
      profilePromise // Return the promise so the caller can await it if needed
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// GitHub Sign In
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    
    // Don't wait for Firestore operation to complete before returning the user
    // Just queue it up to happen in the background
    const profilePromise = getUserProfile(result.user.uid).then(profile => {
      const isFirstTimeUser = !profile;
      storeUserProfile(result.user, isFirstTimeUser);
      return isFirstTimeUser;
    });
    
    // Return immediately with the user
    return { 
      success: true, 
      user: result.user,
      profilePromise
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Fire and forget email verification - don't wait for it
    sendEmailVerification(result.user).catch(err => 
      console.error("Error sending verification email:", err)
    );
    
    // Store user in background - this is always a new user
    storeUserProfile(result.user, true).catch(err => 
      console.error("Error storing user profile:", err)
    );
    
    return { 
      success: true, 
      user: result.user,
      isNewUser: true // For signup, we know it's a new user
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Process profile in the background
    const profilePromise = getUserProfile(userCredential.user.uid).then(profile => {
      const isFirstTimeUser = !profile;
      storeUserProfile(userCredential.user, isFirstTimeUser);
      return isFirstTimeUser;
    });
    
    return {
      success: true,
      user: userCredential.user,
      profilePromise
    };
  } catch (error: any) {
    console.error("Email login error:", error);
    
    let errorMessage = "Failed to sign in";
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email format";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled";
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Update user's isNewUser status to false when they complete onboarding
export const markUserAsExisting = async (uid: string): Promise<boolean> => {
  try {
    console.log(`Updating user ${uid} in Firestore, setting isNewUser=false`);
    
    // Update the user document
    await setDoc(
      doc(db, "users", uid), 
      { 
        isNewUser: false,
        onboardingCompletedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, 
      { merge: true }
    );
    
    console.log(`✅ Successfully updated user ${uid} status in Firestore`);
    return true;
  } catch (error) {
    console.error("Error marking user as existing:", error);
    return false;
  }
};

// Send Email Verification
export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Update User Profile
export const updateUserProfile = async (user: User, displayName?: string, photoURL?: string) => {
  try {
    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL
    });
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Auth state listener
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Function to log Firestore connection details
export const debugFirestoreConnection = async () => {
  if (!auth || !db) {
    console.error("Firebase Auth or Firestore not initialized properly");
    return { success: false, message: "Firebase not initialized" };
  }
  
  try {
    console.log("Checking Firebase connection details...");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("Auth domain:", firebaseConfig.authDomain);
    console.log("Storage bucket:", firebaseConfig.storageBucket);
    
    // Check if we can read from users collection
    try {
      const userDoc = await getDoc(doc(db, "users", "test-user-id"));
      console.log("Access to users collection:", userDoc !== null);
    } catch (error) {
      console.error("Error accessing users collection:", error);
    }
    
    // Check if we can read from blogs collection
    try {
      const blogsRef = collection(db, "blogs");
      console.log("Blogs collection reference created");
    } catch (error) {
      console.error("Error creating blogs collection reference:", error);
    }
    
    return { success: true, message: "Firestore connection debug completed" };
  } catch (error) {
    console.error("Error debugging Firestore connection:", error);
    return { success: false, message: error.message };
  }
};

export { auth, db }; 