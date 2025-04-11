
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut, Beef, Fish, Drumstick, Wheat, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Token types
const TOKEN_TYPES = [
  { id: 'chicken', name: 'Chicken', icon: Drumstick },
  { id: 'beef', name: 'Beef', icon: Beef },
  { id: 'mutton', name: 'Mutton', icon: Wheat },
  { id: 'fish', name: 'Fish', icon: Fish }
];

const TokenPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [showTokenOptions, setShowTokenOptions] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in or not a student
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/');
      return;
    }

    // Load configured months
    const configuredMonths = localStorage.getItem('configuredMonths');
    if (configuredMonths) {
      setAvailableMonths(JSON.parse(configuredMonths));
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId);
    
    toast({
      title: "Token Selected",
      description: `You have selected ${tokenId} token. This will be available on Fridays.`,
    });
    
    // In a real app, this would save the token selection to a database
    setTimeout(() => {
      setShowTokenOptions(false);
    }, 1000);
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
              {availableMonths.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    No months have been configured by the administrator yet.
                    Token selection will be available once months are configured.
                  </p>
                </div>
              ) : !showTokenOptions ? (
                <div className="text-center py-4">
                  <p className="mb-6 text-gray-600">
                    Tokens are available for the following months: 
                    <strong> {availableMonths.join(", ")}</strong>
                  </p>
                  <p className="mb-6 text-gray-600">
                    Would you like to take a token for Friday meals?
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setShowTokenOptions(true)}
                      className="px-6"
                    >
                      Yes, Take Token
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toast({
                        title: "No Token",
                        description: "You have chosen not to take a token at this time."
                      })}
                    >
                      No, Thank You
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <h3 className="text-lg font-medium mb-4 text-center">
                    Select a Token Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TOKEN_TYPES.map((token) => {
                      const Icon = token.icon;
                      const isSelected = selectedToken === token.id;
                      
                      return (
                        <div
                          key={token.id}
                          className={`
                            border rounded-lg p-6 cursor-pointer transition-all
                            hover:border-tripti-primary hover:shadow-md
                            ${isSelected ? 'bg-tripti-primary text-white border-tripti-primary' : 'bg-white'}
                          `}
                          onClick={() => handleTokenSelection(token.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon className="h-8 w-8 mr-4" />
                              <span className="text-lg font-medium">{token.name}</span>
                            </div>
                            {isSelected && <Check className="h-6 w-6" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTokenOptions(false)}
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              )}
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
