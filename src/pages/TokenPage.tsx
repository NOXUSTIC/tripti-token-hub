
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut } from 'lucide-react';

const TokenPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Redirect if not logged in or not a student
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Don't render anything if no current user (prevents flash before redirect)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-tripti-dark">Token Management</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {currentUser.name}</CardTitle>
              <CardDescription>
                Student ID: {currentUser.id} | Email: {currentUser.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is your token management dashboard. Here you can view and manage your tokens.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-tripti-primary">5</div>
              <p className="text-sm text-gray-500">Tokens available for use</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Used Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">2</div>
              <p className="text-sm text-gray-500">Tokens you've already used</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">7</div>
              <p className="text-sm text-gray-500">Your total token allocation</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Token Used</p>
                    <p className="text-sm text-gray-500">Room UB-601, Computer Lab</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                    <p className="text-sm font-medium text-red-500">-1 Token</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Token Used</p>
                    <p className="text-sm text-gray-500">Room UB-501, Electronics Lab</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Yesterday, 2:15 PM</p>
                    <p className="text-sm font-medium text-red-500">-1 Token</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tokens Allocated</p>
                    <p className="text-sm text-gray-500">Monthly allocation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">April 1, 2025</p>
                    <p className="text-sm font-medium text-green-500">+7 Tokens</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="mt-auto py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TRIPTI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default TokenPage;
