import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Lock, Zap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from dashboard (this can be passed via location.state)
  const isFromDashboard = location.state?.fromDashboard || false;
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-one-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto pt-20">
          {/* Back button - only show when coming from dashboard */}
          {isFromDashboard && (
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-one-text-muted hover:text-white flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </div>
          )}
          
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full bg-one-accent/10 text-one-accent text-sm font-medium border border-one-accent/20 mb-4 inline-block">
              PRICING
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Completely Free Access</h1>
            <p className="text-xl text-one-text-muted max-w-2xl mx-auto">
              We haven't launched our pricing model yet. Enjoy free access to our platform with no limitations.
            </p>
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-one-accent/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Free Access</h2>
                  <p className="text-one-text-muted mb-6">
                    Enjoy all features without any cost during our initial launch phase
                  </p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-one-text-muted ml-2">/ month</span>
                  </div>
                  
                  {/* Only show this button when NOT coming from dashboard */}
                  {!isFromDashboard && (
                    <Link
                      to="/"
                      className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
                    >
                      Get Started Now
                    </Link>
                  )}
                </div>
                
                <div className="w-full md:w-auto">
                  <h3 className="text-lg font-semibold mb-4">Everything included:</h3>
                  <ul className="space-y-3">
                    {[
                      'No advertisements',
                      'Access to 1,000+ AI tools',
                      'Real-time dashboard',
                      'Direct redirects to tools',
                      'Personalized recommendations',
                      'Regular updates with new tools'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-one-accent mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Future Pricing Plans</h2>
              <p className="text-one-text-muted">
                While our service is currently free, here's what you can expect in the future:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-one-border rounded-xl p-6 bg-one-card/20">
                <div className="w-12 h-12 bg-one-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-one-accent" size={20} />
                </div>
                <h3 className="text-xl font-semibold mb-2">API Integrations</h3>
                <p className="text-one-text-muted">
                  We're working on direct API integrations with popular AI tools. When launched, these will be available at a low cost to provide seamless access.
                </p>
              </div>
              
              <div className="border border-one-border rounded-xl p-6 bg-one-card/20">
                <div className="w-12 h-12 bg-one-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-one-accent" size={20} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
                <p className="text-one-text-muted">
                  In the future, we may introduce premium features for power users while maintaining a generous free tier for everyone.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-one-text-muted mb-6">
              Contact us anytime for more information about our current and future services.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-2 rounded-lg border border-one-border hover:bg-one-card/50 transition-all duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 