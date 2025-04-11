
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from 'lucide-react';
import Header from '@/components/Header';
import { findUserByEmail, isValidEmail } from '@/utils/authUtils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!email || !isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid BRAC University email",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if user exists
    const user = findUserByEmail(email);
    
    setTimeout(() => {
      if (user) {
        setSubmitted(true);
        toast({
          title: "Success",
          description: "If your email is registered, you will receive password reset instructions.",
        });
      } else {
        // We don't want to tell the user the email doesn't exist for security reasons
        // Just show the same success message
        setSubmitted(true);
        toast({
          title: "Success",
          description: "If your email is registered, you will receive password reset instructions.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you instructions to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@bracu.ac.bd"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Reset Password"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-gray-600">
                    We've sent password reset instructions to <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    If you don't see it, please check your spam folder
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Link to="/" className="text-tripti-primary hover:text-tripti-dark font-medium">
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="mt-auto py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TRIPTI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
