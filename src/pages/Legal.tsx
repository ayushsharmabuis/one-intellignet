import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useLocation } from 'react-router-dom';
import { File, Shield, FileText } from 'lucide-react';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies'>('terms');
  const location = useLocation();
  
  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'privacy' || hash === 'terms' || hash === 'cookies') {
      setActiveTab(hash as 'privacy' | 'terms' | 'cookies');
      
      // Scroll to the section after a short delay to ensure the DOM has updated
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-one-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-center">Legal Information</h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {[
              { id: 'terms', label: 'Terms of Service', icon: FileText },
              { id: 'privacy', label: 'Privacy Policy', icon: Shield },
              { id: 'cookies', label: 'Cookie Policy', icon: File }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  activeTab === tab.id
                    ? 'bg-one-accent text-white'
                    : 'bg-one-card text-one-text-muted hover:bg-one-light'
                } transition-colors duration-200`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-8">
            {activeTab === 'terms' && (
              <div id="terms" className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>
                <p className="text-sm text-one-text-muted mb-4">Last updated: January 2025</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h3>
                <p>Welcome to One-Intelligent, a platform that consolidates AI tools. By accessing or using our service, you agree to be bound by these Terms of Service.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">2. Using Our Services</h3>
                <p>You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">3. Your Account</h3>
                <p>You may need an account to use some of our Services. You are responsible for maintaining the security of your account and password. One-Intelligent cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">4. Third-Party Services</h3>
                <p>One-Intelligent integrates with various third-party AI tools and services. Your use of these third-party services is subject to their respective terms and conditions. We are not responsible for the content, privacy policies, or practices of any third-party services.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">5. Content</h3>
                <p>Our Services allow you to submit, store, send, or receive content. You retain ownership of any intellectual property rights that you hold in that content.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">6. Modifications</h3>
                <p>We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">7. Disclaimer</h3>
                <p>ONE-INTELLIGENT PROVIDES THE SERVICES "AS IS" AND "AS AVAILABLE", WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div id="privacy" className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
                <p className="text-sm text-one-text-muted mb-4">Last updated: January 2025</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h3>
                <p>We collect information to provide better services to our users, including:</p>
                <ul>
                  <li>Account information: Email address, name, and password when you create an account</li>
                  <li>Usage information: How you use our service, which AI tools you access</li>
                  <li>Device information: Hardware model, operating system, unique device identifiers</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">2. How We Use Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Develop new services and features</li>
                  <li>Personalize your experience</li>
                  <li>Communicate with you about our services</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h3>
                <p>We do not share your personal information with companies, organizations, or individuals outside of One-Intelligent except in the following cases:</p>
                <ul>
                  <li>With your consent</li>
                  <li>For legal reasons</li>
                  <li>With trusted third-party service providers who work on our behalf</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h3>
                <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h3>
                <p>Depending on your location, you may have certain rights regarding your personal data, such as the right to access, correct, or delete your data.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">6. Changes</h3>
                <p>Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.</p>
              </div>
            )}
            
            {activeTab === 'cookies' && (
              <div id="cookies" className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">Cookie Policy</h2>
                <p className="text-sm text-one-text-muted mb-4">Last updated: January 2025</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">1. What Are Cookies</h3>
                <p>Cookies are small pieces of text sent to your browser by a website you visit. They help that website remember information about your visit, like your preferred language and other settings.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">2. How We Use Cookies</h3>
                <p>We use cookies for the following purposes:</p>
                <ul>
                  <li>Authentication: To remember your login state</li>
                  <li>Preferences: To remember your settings and preferences</li>
                  <li>Analytics: To understand how visitors interact with our website</li>
                  <li>Security: To help identify and prevent security risks</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h3>
                <p>We use both session cookies and persistent cookies:</p>
                <ul>
                  <li>Session cookies: These are temporary and expire when you close your browser</li>
                  <li>Persistent cookies: These remain on your device until they expire or you delete them</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">4. Managing Cookies</h3>
                <p>Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect the functionality of our website.</p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">5. Changes</h3>
                <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-one-text-muted mb-6">
              If you have any questions about our legal policies, please contact us.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal; 