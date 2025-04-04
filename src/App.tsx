import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './lib/AuthContext';
import './App.css';
import './styles/animations.css';
import Index from './pages/Index';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Integrations from './pages/Integrations';
import Careers from './pages/Careers';
import Legal from './pages/Legal';
import WhatsNew from './pages/WhatsNew';
import NotFound from './pages/NotFound';
import UploadTools from './pages/UploadTools';
import Dashboard from './components/Dashboard';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import AdminBlog from './pages/admin/AdminBlog';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { currentUser, loading } = useAuth();
  
  // Show nothing while authentication is being checked
  if (loading) return null;
  
  // Redirect to home if not authenticated
  if (!currentUser) return <Navigate to="/" replace />;
  
  // For now, all authenticated users can access admin features
  // In a production app, you would check user roles here
  // if (requireAdmin && !isUserAdmin(currentUser)) return <Navigate to="/" replace />;
  
  // Render children if authenticated
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/whats-new" element={<WhatsNew />} />
            <Route path="/upload-tools" element={<UploadTools />} />
            
            {/* Blog routes */}
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard preferences={{
                    interests: [],
                    frequency: '',
                    pricingPreference: '',
                    completedQuestionnaire: true
                  }} />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/blogs" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlog />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
};

export default App;
