import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-one-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-center">About One-Intelligent</h1>
          
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <div className="md:w-1/3">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-one-border mb-4">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Arpit - Founder of One-Intelligent" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-one-dark/80 via-transparent to-transparent"></div>
              </div>
              <h2 className="text-xl font-semibold">Arpit</h2>
              <p className="text-one-text-muted">Founder & CEO</p>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-one-accent">Our Story</h2>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <p>
                  One-Intelligent began with a simple observation: the growing landscape of AI tools was becoming increasingly fragmented and overwhelming.
                </p>
                
                <blockquote className="pl-4 border-l-4 border-one-accent italic">
                  "I found myself constantly switching between different AI platforms, with separate accounts, payments, and interfaces for each one. I thought, 'Why not consolidate all these powerful tools in one place?'"
                </blockquote>
                
                <p>
                  In early 2023, while working on various projects that required different AI capabilities, I experienced firsthand the challenges of managing multiple AI tools. Each one had different interfaces, pricing models, and learning curves. This fragmentation was not only inefficient but also created barriers to entry for those new to AI technologies.
                </p>
                
                <p>
                  This frustration sparked the idea for One-Intelligent: a unified platform where users could access over 1,000 AI tools through a single, intuitive interface. No more juggling multiple subscriptions or learning new interfaces with each tool.
                </p>
                
                <p>
                  Our mission is to democratize access to AI by creating a streamlined experience that works for everyone—from AI enthusiasts to businesses looking to leverage cutting-edge technology without the complexity.
                </p>
                
                <h3 className="text-xl font-semibold">Looking Forward</h3>
                
                <p>
                  As we continue to grow, our focus remains on three core principles:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Accessibility:</strong> Making powerful AI tools available to everyone, regardless of technical expertise.</li>
                  <li><strong>Integration:</strong> Seamlessly connecting diverse AI capabilities in one platform.</li>
                  <li><strong>Innovation:</strong> Continuously expanding our ecosystem to include the latest advancements in AI.</li>
                </ul>
                
                <p>
                  We believe that AI should be a force multiplier for human creativity and productivity, not a source of additional complexity. Join us on this journey to simplify and amplify the potential of artificial intelligence.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-one-border pt-12 mt-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Our Vision</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-one-card/30 backdrop-blur-sm border border-one-border p-6 rounded-xl">
                <div className="w-12 h-12 bg-one-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="text-one-accent" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Simplify AI Access</h3>
                <p className="text-one-text-muted">
                  Creating a world where advanced AI tools are accessible without technical barriers or multiple subscriptions.
                </p>
              </div>
              
              <div className="bg-one-card/30 backdrop-blur-sm border border-one-border p-6 rounded-xl">
                <div className="w-12 h-12 bg-one-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-one-accent">
                    <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27002 6.96002L12 12L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Empower Creativity</h3>
                <p className="text-one-text-muted">
                  Enabling users to focus on creation and innovation, not managing multiple AI tool subscriptions.
                </p>
              </div>
              
              <div className="bg-one-card/30 backdrop-blur-sm border border-one-border p-6 rounded-xl">
                <div className="w-12 h-12 bg-one-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <ArrowUpRight className="text-one-accent" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Future Integration</h3>
                <p className="text-one-text-muted">
                  Building toward seamless API integrations that will bring thousands of AI tools together at affordable prices.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
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

export default About; 