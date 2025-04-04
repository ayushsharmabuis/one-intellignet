import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword, signInWithEmail as firebaseSignInWithEmail } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import Logo from './Logo';

interface SignupPageProps {
  onBack: () => void;
  onSignup: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [formLoaded, setFormLoaded] = useState(true);
  const { toast } = useToast();
  const { setCurrentUser, setIsNewUser } = useAuth();

  useEffect(() => {
    // Detect if this is a desktop device - only apply animations on desktop
    const isDesktop = window.innerWidth >= 1024;
    
    // Skip animation on mobile devices for better performance
    if (isDesktop) {
      setFormLoaded(false);
      const timer = setTimeout(() => {
        setFormLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUpWithEmail(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        // For signups we know it's a new user 
        setIsNewUser(true);
        
        toast({
          title: "Account created!",
          description: "A verification email has been sent to your email address. Please verify your account.",
        });
        console.log("Calling onSignup function");
        onSignup();
      } else {
        toast({
          title: "Sign up failed",
          description: result.error || "An error occurred during sign up.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        setCurrentUser(result.user);
        
        // For Google logins, we need to determine if they're new or returning
        if (result.profilePromise) {
          try {
            // Wait for profile promise with a timeout to prevent infinite loading
            const isNewUserResult = await Promise.race([
              result.profilePromise,
              new Promise<boolean>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
              )
            ]);
            
            setIsNewUser(!!isNewUserResult);
          } catch (err) {
            console.error("Error or timeout fetching profile:", err);
            // Assume new user if we can't determine (safer default)
            setIsNewUser(true);
          }
        }
        
        toast({
          title: "Google Sign In Successful",
          description: "Welcome to One-Intelligent!",
        });
        
        console.log("Calling onSignup function");
        onSignup();
      } else {
        toast({
          title: "Google Sign In Failed",
          description: result.error || "An error occurred during Google sign in.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "An error occurred during Google sign in.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithGithub();
      
      if (result.success) {
        setCurrentUser(result.user);
        
        // For GitHub logins, we need to determine if they're new or returning
        if (result.profilePromise) {
          try {
            // Wait for profile promise with a timeout to prevent infinite loading
            const isNewUserResult = await Promise.race([
              result.profilePromise,
              new Promise<boolean>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
              )
            ]);
            
            setIsNewUser(!!isNewUserResult);
          } catch (err) {
            console.error("Error or timeout fetching profile:", err);
            // Assume new user if we can't determine (safer default)
            setIsNewUser(true);
          }
        }
        
        toast({
          title: "GitHub Sign In Successful",
        description: "Welcome to One-Intelligent!",
      });
        
        console.log("Calling onSignup function");
      onSignup();
      } else {
        toast({
          title: "GitHub Sign In Failed",
          description: result.error || "An error occurred during GitHub sign in.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "GitHub Sign In Failed",
        description: error.message || "An error occurred during GitHub sign in.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!resetEmail) {
      toast({
        title: "Missing email",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for instructions to reset your password.",
        });
        setShowPasswordReset(false);
      } else {
        toast({
          title: "Failed to send reset email",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing information",
        description: "Please enter email and password.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await firebaseSignInWithEmail(loginEmail, loginPassword);
      
      if (result.success) {
        setCurrentUser(result.user);
        
        // For email logins, we need to determine if they're new or returning
        if (result.profilePromise) {
          try {
            // Wait for profile promise with a timeout to prevent infinite loading
            const isNewUserResult = await Promise.race([
              result.profilePromise,
              new Promise<boolean>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
              )
            ]);
            
            setIsNewUser(!!isNewUserResult);
          } catch (err) {
            console.error("Error or timeout fetching profile:", err);
            // Assume new user if we can't determine (safer default)
            setIsNewUser(false); // For login, default to returning user
          }
        }
        
        toast({
          title: "Sign In Successful",
          description: "Welcome back to One-Intelligent!",
        });
        onSignup();
      } else {
        toast({
          title: "Sign In Failed",
          description: result.error || "An error occurred during sign in.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const toggleLoginView = () => {
    setShowLogin(!showLogin);
    if (!showLogin) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // Create login/signup form
  const createAccountForm = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="form-group">
          <div className="relative">
            <Input
              id="email"
              placeholder=" "
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="email"
              disabled={isLoading}
            />
            <Label 
              htmlFor="email" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Email address
            </Label>
            <Mail className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
          </div>
        </div>
        
        <div className="form-group">
          <div className="relative">
            <Input
              id="password"
              placeholder=" "
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <Label 
              htmlFor="password" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Password
            </Label>
            <Lock className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
            <button
              type="button"
              className="absolute right-3 top-4 text-one-text-muted hover:text-one-text transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <div className="relative">
            <Input
              id="confirm-password"
              placeholder=" "
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <Label 
              htmlFor="confirm-password" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Confirm password
            </Label>
            <Lock className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
            <button
              type="button"
              className="absolute right-3 top-4 text-one-text-muted hover:text-one-text transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="pt-2">
          {isLoading ? (
            <Button disabled className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center w-full h-full">
              Create Account
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#7B5CFA] to-[#9B87F5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
  
  const loginForm = (
    <form onSubmit={handleLoginSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="form-group">
          <div className="relative">
            <Input
              id="login-email"
              placeholder=" "
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="email"
              disabled={isLoading}
            />
            <Label 
              htmlFor="login-email" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Email address
            </Label>
            <Mail className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
          </div>
        </div>
        
        <div className="form-group">
          <div className="relative">
            <Input
              id="login-password"
              placeholder=" "
              type={showLoginPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <Label 
              htmlFor="login-password" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Password
            </Label>
            <Lock className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
            <button
              type="button"
              className="absolute right-3 top-4 text-one-text-muted hover:text-one-text transition-colors"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
            >
              {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex justify-end mt-1.5">
            <button 
              type="button" 
              onClick={() => {
                setShowLogin(false);
                setShowPasswordReset(true);
              }}
              className="text-xs text-one-accent hover:text-one-accent/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>
        
        <div className="pt-2">
          {isLoading ? (
            <Button disabled className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center w-full h-full">
              Sign In
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#7B5CFA] to-[#9B87F5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
  
  const resetPasswordForm = (
    <form onSubmit={handleResetPassword} className="space-y-5">
      <div className="space-y-4">
        <div className="form-group">
          <div className="relative">
            <Input
              id="reset-email"
              placeholder=" "
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="h-12 px-4 pt-4 bg-one-darker/40 border-one-border/40 focus:border-one-accent/70 focus:ring-one-accent/40 transition-all rounded-lg peer pl-10"
              autoComplete="email"
              disabled={isLoading}
            />
            <Label 
              htmlFor="reset-email" 
              className="absolute text-one-text-muted left-10 top-3.5 text-sm transition-all duration-200 peer-focus:text-xs peer-focus:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2"
            >
              Email address
            </Label>
            <Mail className="absolute left-3 top-4 h-4 w-4 text-one-text-muted peer-focus:text-one-accent transition-colors" />
          </div>
        </div>
        
        <div className="pt-2">
          {isLoading ? (
            <Button disabled className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full bg-one-accent hover:bg-one-accent/90 transition-all shadow-glow-sm h-12 text-base font-medium relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center w-full h-full">
              Send Reset Link
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#7B5CFA] to-[#9B87F5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-one-dark p-3 sm:p-4">
      {/* Only render animated background on desktop */}
      {window.innerWidth >= 1024 && (
        <>
          <div className="animated-background"></div>
          <div className="animated-glow"></div>
        </>
      )}
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-one-text-muted hover:text-white flex items-center gap-1.5 p-2 h-auto group transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </Button>
      </div>

      <div 
        className={`w-full max-w-[370px] sm:max-w-md relative z-10 ${
          window.innerWidth >= 1024 
            ? `transform transition-all duration-300 ${formLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`
            : ''
        }`}
      >
        <Card className="border-none shadow-2xl bg-one-card/20 backdrop-blur-2xl overflow-hidden">
          <div className="absolute inset-0 border border-one-border/30 rounded-2xl"></div>
          {window.innerWidth >= 1024 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-one-accent/5 to-transparent opacity-50"></div>
              <div className="card-glare rounded-2xl"></div>
            </>
          )}
          
          <CardHeader className="space-y-1.5 text-center px-7 pt-8 pb-5 relative z-10">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <div className="w-12 h-12 bg-one-accent/10 rounded-full mx-auto mb-3 flex items-center justify-center shadow-glow-sm">
              <div className="w-9 h-9 bg-one-accent/20 rounded-full flex items-center justify-center">
                <div className="text-one-accent text-xl font-bold">1</div>
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            {showPasswordReset 
              ? "Reset your password" 
              : showLogin 
                  ? "Sign in to continue" 
                : "Create an account"}
          </CardTitle>
            <CardDescription className="text-sm text-one-text-muted">
            {showPasswordReset 
              ? "Enter your email to receive a password reset link" 
              : showLogin 
                ? "Sign in to access all AI tools in one place" 
                : "Join One-Intelligent to access all AI tools in one place"}
          </CardDescription>
        </CardHeader>
          
          <CardContent className="space-y-5 px-7 relative z-10">
          {showPasswordReset ? (
            resetPasswordForm
          ) : showLogin ? (
            loginForm
          ) : (
            createAccountForm
          )}
              
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-one-border/50" />
                </div>
              <div className="relative px-4 text-xs uppercase bg-one-card/5 backdrop-blur-md text-one-text-muted font-medium">
                  Or continue with
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                className="social-button border-one-border/50 bg-one-darker/30 hover:bg-one-accent/20 hover:border-one-accent/30 hover:text-white h-12 font-medium relative overflow-hidden group transition-all"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-2 google-icon" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                      <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163129 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                      <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                      <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                  </svg>
                    Google
                  </div>
              )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                className="social-button border-one-border/50 bg-one-darker/30 hover:bg-one-accent/20 hover:border-one-accent/30 hover:text-white h-12 font-medium relative overflow-hidden group transition-all"
                  onClick={handleGithubSignup}
                  disabled={isLoading}
                >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"/>
                    </svg>
                    GitHub
                  </div>
                )}
                </Button>
              </div>
        </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-one-text-muted py-5 px-7 relative z-10">
          {showPasswordReset ? (
            <span>
              Remember your password?{" "}
              <button 
                  className="text-one-accent hover:text-one-accent/80 transition-colors"
                onClick={() => {
                  setShowPasswordReset(false);
                  setShowLogin(true);
                }}
              >
                Sign in
              </button>
            </span>
          ) : showLogin ? (
            <span>
              Don't have an account?{" "}
              <button 
                  className="text-one-accent hover:text-one-accent/80 transition-colors"
                onClick={toggleLoginView}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button 
                  className="text-one-accent hover:text-one-accent/80 transition-colors"
                onClick={toggleLoginView}
              >
                Sign in
              </button>
            </span>
          )}
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default SignupPage;
