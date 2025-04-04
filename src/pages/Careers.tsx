import React from 'react';
import Navbar from '../components/Navbar';
import { GraduationCap, BookOpen, ArrowRight, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Careers: React.FC = () => {
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Build Your AI Career With Us</h1>
            <p className="text-xl text-one-text-muted max-w-2xl mx-auto">
              We're launching courses to help you master AI tools and build a successful career in this rapidly growing field.
            </p>
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-one-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6">Upcoming AI Courses</h2>
              
              <div className="space-y-8">
                {[
                  {
                    icon: GraduationCap,
                    title: "AI Tools Mastery",
                    description: "Learn how to effectively use today's most powerful AI tools to enhance your productivity and creative output.",
                    duration: "6 weeks",
                    level: "Beginner to Intermediate",
                    coming: "Q1 2025"
                  },
                  {
                    icon: BookOpen,
                    title: "Building with AI APIs",
                    description: "Develop practical skills for integrating AI services into your applications using modern APIs and frameworks.",
                    duration: "8 weeks",
                    level: "Intermediate",
                    coming: "Q2 2025 - 26"
                  },
                  {
                    icon: Calendar,
                    title: "AI Career Bootcamp",
                    description: "Comprehensive training program designed to prepare you for in-demand roles in AI product management and implementation.",
                    duration: "12 weeks",
                    level: "All Levels",
                    coming: "Q3 2025-26"
                  }
                ].map((course, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-6 border-b border-one-border pb-8 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-one-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <course.icon className="text-one-accent" size={28} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-one-accent/20 text-one-accent">
                          Coming {course.coming}
                        </span>
                      </div>
                      <p className="text-one-text-muted mb-4">{course.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-one-card border border-one-border">
                          Duration: {course.duration}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-one-card border border-one-border">
                          Level: {course.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-one-card/30 backdrop-blur-sm border border-one-border rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Why Learn AI Skills With Us</h2>
              <p className="text-one-text-muted">
                One-Intelligent offers a unique learning experience focused on practical applications of AI tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Our Approach</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-one-accent/20 text-one-accent text-center flex-shrink-0 mt-1 mr-3">✓</span>
                    <span className="text-one-text-muted">Practical, hands-on projects with real-world applications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-one-accent/20 text-one-accent text-center flex-shrink-0 mt-1 mr-3">✓</span>
                    <span className="text-one-text-muted">Learn from experts who work with these tools daily</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-one-accent/20 text-one-accent text-center flex-shrink-0 mt-1 mr-3">✓</span>
                    <span className="text-one-text-muted">Focus on skills that are in high demand in the job market</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-one-accent/20 text-one-accent text-center flex-shrink-0 mt-1 mr-3">✓</span>
                    <span className="text-one-text-muted">Regular updates to keep pace with rapidly evolving AI technology</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Career Opportunities</h3>
                <p className="text-one-text-muted mb-4">
                  After completing our courses, you'll be equipped for roles such as:
                </p>
                <ul className="space-y-2">
                  <li className="px-3 py-2 bg-one-card/50 rounded-lg">AI Implementation Specialist</li>
                  <li className="px-3 py-2 bg-one-card/50 rounded-lg">AI Content Creator</li>
                  <li className="px-3 py-2 bg-one-card/50 rounded-lg">AI Solutions Architect</li>
                  <li className="px-3 py-2 bg-one-card/50 rounded-lg">AI Product Manager</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-one-text-muted mb-6">
              Join our waitlist to be the first to know when our courses launch.
            </p>
            {!isFromDashboard && (
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
              >
                Join Waitlist <ArrowRight className="ml-2" size={16} />
              </Link>
            )}
            {isFromDashboard && (
              <Button 
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-one-accent hover:bg-one-accent/90 text-white transition-all duration-300"
              >
                Return to Dashboard <ArrowRight className="ml-2" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 