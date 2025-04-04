import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UploadToolsPageProps {
  onBack: () => void;
}

const UploadToolsPage: React.FC<UploadToolsPageProps> = ({ onBack }) => {
  // Function to handle email redirection
  const handleEmailClick = () => {
    window.location.href = "mailto:ayushsharmabuis@gmail.com?subject=Tool Submission for One-Intelligent&body=Hello,%0A%0AI would like to submit a tool for One-Intelligent platform.%0A%0ATool Name:%0ADescription:%0AWebsite URL:%0AAPI Documentation (if available):%0A%0AThank you!";
  };

  // Add logging to help debug
  useEffect(() => {
    console.log("UploadToolsPage mounted");
    return () => {
      console.log("UploadToolsPage unmounted");
    };
  }, []);

  return (
    <div className="w-full bg-one-dark p-4">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => {
            console.log("Back button clicked");
            onBack();
          }}
          className="text-one-text-muted hover:text-white flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto border-one-border bg-one-card/30 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Upload Your AI Tools</CardTitle>
          <CardDescription>
            Join the One-Intelligent ecosystem by submitting your AI tool
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-one-text">How to submit your tool</h3>
            <p className="text-one-text-muted">
              We're excited that you're interested in adding your AI tool to our platform! 
              One-Intelligent aims to be the most comprehensive directory of AI tools available.
              Follow these steps to submit your tool for review:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-one-text-muted pl-4">
              <li>Click the "Send Email" button below</li>
              <li>Fill out the email template with your tool's information</li>
              <li>Include links to your tool's website and any API documentation</li>
              <li>Our team will review your submission within 3-5 business days</li>
              <li>Once approved, your tool will be available to all One-Intelligent users</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-one-text">Requirements</h3>
            <ul className="list-disc list-inside text-one-text-muted pl-4 space-y-2">
              <li>Your AI tool must be fully functional and accessible online</li>
              <li>You must be the owner or have permission to submit the tool</li>
              <li>The tool must comply with our community guidelines and privacy policy</li>
              <li>Tools that provide value to users will be prioritized</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-one-text">Privacy Policy Summary</h3>
            <p className="text-one-text-muted">
              At One-Intelligent, we respect your privacy and are committed to protecting it. When submitting your tool:
            </p>
            <ul className="list-disc list-inside text-one-text-muted pl-4 space-y-2">
              <li>We collect only the information necessary to review and list your tool</li>
              <li>Your contact information is used only for communication about your submission</li>
              <li>We do not share your information with third parties without consent</li>
              <li>Tools must comply with data protection regulations like GDPR</li>
            </ul>
            <p className="text-one-text-muted mt-2">
              For the complete privacy policy, please visit our <Link to="/legal" className="text-one-accent hover:underline">Privacy Policy page</Link>.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={handleEmailClick}
            className="bg-one-accent hover:bg-one-accent-hover text-white flex items-center gap-2 py-6 px-8 text-lg"
          >
            <Mail size={20} />
            Send Email to Submit Tool
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadToolsPage; 