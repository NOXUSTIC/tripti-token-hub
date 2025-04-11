
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-tripti-dark">
              TRIPTI Token Management System
            </h1>
            <p className="text-lg text-gray-600">
              A streamlined platform for BRAC University students and administrators to manage tokens efficiently.
            </p>
            <div className="hidden md:block">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="bg-tripti-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">✓</span>
                  <span>Secure authentication system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-tripti-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">✓</span>
                  <span>Role-based access for students and administrators</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-tripti-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">✓</span>
                  <span>Efficient token management</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:w-1/2 w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                <CardDescription className="text-center">
                  Enter your BRAC University email and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                <div className="text-sm text-center text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-tripti-primary hover:text-tripti-dark font-medium">
                    Sign up
                  </Link>
                </div>
                <div className="text-sm text-center text-gray-500">
                  <Link to="/forgot-password" className="text-tripti-primary hover:text-tripti-dark font-medium">
                    Forgot your password?
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
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

export default Index;
