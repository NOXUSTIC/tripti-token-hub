
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut, Beef, Fish, Drumstick, Wheat, Check, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { clearStudentTokenData, clearAllUserData, getStudentTokenData } from '@/utils/dataUtils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

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
  const [totalFridays, setTotalFridays] = useState(0);
  const [usedTokens, setUsedTokens] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showWeeklyLimitDialog, setShowWeeklyLimitDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/');
      return;
    }

    const configuredMonths = localStorage.getItem('configuredMonths');
    if (configuredMonths) {
      const months = JSON.parse(configuredMonths);
      setAvailableMonths(months);
      
      calculateTotalFridays(months);
    }
    
    // Get tokens from the centralized database
    const userTokens = getStudentTokenData(currentUser.id);
    setUsedTokens(userTokens.length);
    
  }, [currentUser, navigate]);

  const calculateTotalFridays = (months: string[]) => {
    let totalFridays = 0;
    
    months.forEach(monthStr => {
      const [monthName, yearStr] = monthStr.split(' ');
      const year = parseInt(yearStr);
      
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = monthNames.indexOf(monthName);
      
      if (monthIndex !== -1) {
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, monthIndex, day);
          if (date.getDay() === 5) {
            totalFridays++;
          }
        }
      }
    });
    
    setTotalFridays(totalFridays);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const checkWeeklyTokenLimit = () => {
    if (!currentUser) return true;
    
    const userTokens = getStudentTokenData(currentUser.id);
    
    if (userTokens.length === 0) return false;
    
    const now = new Date();
    
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);
    
    const tokenThisWeek = userTokens.some((token: any) => {
      const tokenDate = new Date(token.date);
      return tokenDate >= currentWeekStart && tokenDate <= currentWeekEnd;
    });
    
    return tokenThisWeek;
  };

  const handleTokenRequest = () => {
    const hasTokenThisWeek = checkWeeklyTokenLimit();
    
    if (hasTokenThisWeek) {
      setShowWeeklyLimitDialog(true);
    } else {
      setShowTokenOptions(true);
    }
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId);
    setIsConfirming(true);
  };
  
  const confirmTokenSelection = () => {
    if (!currentUser) return;
    
    // Store in the centralized database
    const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
    if (!db.tokens) db.tokens = [];
    
    db.tokens.push({
      type: selectedToken,
      date: new Date().toISOString(),
      studentId: currentUser.id,
      foodType: selectedToken
    });
    
    localStorage.setItem('tripti_db', JSON.stringify(db));
    
    // Update the local state
    setUsedTokens(prev => prev + 1);
    
    toast({
      title: "Token Confirmed",
      description: `You have confirmed ${selectedToken} token. This will be available on Fridays.`,
    });
    
    setSelectedToken(null);
    setIsConfirming(false);
    setShowTokenOptions(false);
  };
  
  const cancelTokenSelection = () => {
    setSelectedToken(null);
    setIsConfirming(false);
  };

  const handleResetData = () => {
    if (!currentUser) return;
    
    clearStudentTokenData(currentUser.id);
    setUsedTokens(0);
    toast({
      title: "Data Reset",
      description: "Your token data has been successfully reset.",
    });
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all student data? This action cannot be undone.')) {
      clearAllUserData();
      toast({
        title: "Success",
        description: "All student data has been cleared.",
      });
      navigate('/');
    }
  };

  if (!currentUser) {
    return null;
  }

  const availableTokens = totalFridays - usedTokens;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-tripti-dark">Token Management</h1>
          <div className="flex gap-4">
            {currentUser?.role === 'admin' && (
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={handleClearAllData}
              >
                Clear All Student Data
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleResetData}
            >
              <RefreshCw className="h-4 w-4" />
              Reset My Data
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
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
                      onClick={handleTokenRequest}
                      className="px-6"
                      disabled={availableTokens <= 0}
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
                  {availableTokens <= 0 && (
                    <p className="mt-4 text-red-500">
                      You have used all available tokens for the selected months.
                    </p>
                  )}
                </div>
              ) : isConfirming ? (
                <div className="py-4 text-center">
                  <h3 className="text-lg font-medium mb-4">
                    Confirm Your Selection
                  </h3>
                  <p className="mb-6 text-gray-600">
                    You have selected <strong>{selectedToken}</strong> token. Would you like to confirm?
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={confirmTokenSelection}
                      className="px-6"
                    >
                      Confirm Selection
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={cancelTokenSelection}
                    >
                      Cancel
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
              <div className="text-3xl font-bold text-tripti-primary">{availableTokens}</div>
              <p className="text-sm text-gray-500">Tokens available for use</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Used Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{usedTokens}</div>
              <p className="text-sm text-gray-500">Tokens you've already used</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalFridays}</div>
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
                    <p className="text-sm text-gray-500">January 1, 2025</p>
                    <p className="text-sm font-medium text-green-500">+{totalFridays} Tokens</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showWeeklyLimitDialog} onOpenChange={setShowWeeklyLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weekly Token Limit Reached</DialogTitle>
            <DialogDescription>
              You have already taken a token for this week. You can only take one token per week.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWeeklyLimitDialog(false)}>
              Okay, I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="mt-auto py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TRIPTI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default TokenPage;

