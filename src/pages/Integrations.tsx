import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Integrations: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from dashboard
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
              COMING SOON
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">AI Tool Integrations</h1>
            <p className="text-xl text-one-text-muted max-w-2xl mx-auto">
              We're launching tools integration that help you to access multiple AI tools in low cost.
            </p>
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-12 mb-16 relative overflow-hidden text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-one-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Unified AI Experience</h2>
              <p className="text-xl text-one-text-muted mb-8 max-w-2xl mx-auto">
                Access all your favorite AI tools through a single platform at a fraction of the cost. 
                No more juggling multiple subscriptions or interfaces.
              </p>
              
              <div className="inline-flex items-center justify-center">
                <Link
                  to={isFromDashboard ? "/dashboard" : "/"}
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300 text-lg"
                >
                  {isFromDashboard ? "Return to Dashboard" : "Get Early Access"} <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations; 