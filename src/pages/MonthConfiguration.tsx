
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut, Calendar, Lock, Check, Users } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import {
  getTokenStatistics,
  getTotalTokens,
  getUsedTokens,
  getRemainingTokens
} from '@/utils/tokenUtils';

const MonthConfiguration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [tokenStats, setTokenStats] = useState<Array<{
    month: string;
    total: number;
    used: number;
    remaining: number;
  }>>([]);
  
  // Navigate away if not admin
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // Generate months list
  useEffect(() => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthsList = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      monthsList.push(`${monthNames[monthIndex]} ${year}`);
    }
    
    setMonths(monthsList);
  }, []);

  // Load saved data
  useEffect(() => {
    const savedMonths = localStorage.getItem('configuredMonths');
    const savedIsConfirmed = localStorage.getItem('monthsConfirmed');
    
    if (savedMonths) {
      const parsedMonths = JSON.parse(savedMonths);
      setSelectedMonths(parsedMonths);
      
      if (savedIsConfirmed && JSON.parse(savedIsConfirmed)) {
        setIsConfirmed(true);
        setTokenStats(getTokenStatistics());
      }
    }
  }, []);

  // Handlers
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleMonthToggle = (month: string) => {
    if (isConfirmed) return;
    
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        return prev.filter(m => m !== month);
      } else {
        if (prev.length < 3) {
          return [...prev, month];
        }
        return prev;
      }
    });
  };

  const handleConfirm = () => {
    if (selectedMonths.length !== 3) {
      toast({
        title: "Error",
        description: "Please select exactly 3 months",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('configuredMonths', JSON.stringify(selectedMonths));
    localStorage.setItem('monthsConfirmed', JSON.stringify(true));
    
    setIsConfirmed(true);
    setTokenStats(getTokenStatistics());
    
    toast({
      title: "Success",
      description: "Months configured successfully",
    });
  };

  const handleEdit = () => {
    const mockOtp = '123456';
    console.log('OTP for verification:', mockOtp);
    
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email",
    });
    
    setShowOtpDialog(true);
  };

  const handleVerifyOtp = () => {
    const mockOtp = '123456';
    
    if (otp === mockOtp) {
      setIsConfirmed(false);
      localStorage.setItem('monthsConfirmed', JSON.stringify(false));
      
      setShowOtpDialog(false);
      setOtp('');
      
      toast({
        title: "Success",
        description: "You can now edit the months",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again",
        variant: "destructive",
      });
    }
  };

  // Don't render anything if no user
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-tripti-dark">Month Configuration</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configure Token Months</CardTitle>
            <CardDescription>
              Select 3 months for which tokens will be available on Fridays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {months.map((month) => (
                <div 
                  key={month}
                  onClick={() => handleMonthToggle(month)}
                  className={`
                    p-4 rounded-md border cursor-pointer transition-all
                    ${selectedMonths.includes(month) 
                      ? 'bg-tripti-primary text-white border-tripti-primary' 
                      : 'bg-white hover:bg-gray-50 border-gray-200'}
                    ${isConfirmed ? 'opacity-80 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      <span>{month}</span>
                    </div>
                    {selectedMonths.includes(month) && (
                      <Check className="h-5 w-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isConfirmed ? (
              <>
                <div className="text-sm text-gray-500 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Configuration locked. Tokens will be available for the selected months.
                </div>
                <Button onClick={handleEdit} variant="outline">
                  Edit Configuration
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-500">
                  {selectedMonths.length}/3 months selected
                </div>
                <Button 
                  onClick={handleConfirm} 
                  disabled={selectedMonths.length !== 3}
                >
                  Confirm Selection
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
        
        {selectedMonths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Months</CardTitle>
              <CardDescription>
                Tokens will be available on Fridays for these months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedMonths.map((month) => (
                  <li 
                    key={month}
                    className="flex items-center p-3 bg-gray-50 rounded-md"
                  >
                    <Calendar className="mr-3 h-5 w-5 text-tripti-primary" />
                    <span>{month}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {isConfirmed && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-3 h-5 w-5" />
                Token Statistics
              </CardTitle>
              <CardDescription>
                Track token usage for each configured month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-center py-3 px-4">Total Tokens</th>
                      <th className="text-center py-3 px-4">Used Tokens</th>
                      <th className="text-center py-3 px-4">Remaining Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMonths.map((month) => {
                      const total = getTotalTokens();
                      const used = getUsedTokens(month);
                      const remaining = getRemainingTokens(month);
                      
                      return (
                        <tr key={month} className="border-b">
                          <td className="py-3 px-4">{month}</td>
                          <td className="text-center py-3 px-4">{total}</td>
                          <td className="text-center py-3 px-4">{used}</td>
                          <td className="text-center py-3 px-4">{remaining}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your email to edit the configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <InputOTP 
              maxLength={6} 
              value={otp} 
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOtpDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyOtp}>
              Verify
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

export default MonthConfiguration;
