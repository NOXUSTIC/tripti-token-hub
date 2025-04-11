
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut, Calendar, Lock, Check } from 'lucide-react';
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

const MonthConfiguration = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Generate months (current month + 11 future months)
    const generateMonths = () => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const months = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i) % 12;
        const year = currentYear + Math.floor((currentMonth + i) / 12);
        months.push(`${monthNames[monthIndex]} ${year}`);
      }
      
      return months;
    };
    
    // Load previously configured months from localStorage if available
    const loadMonths = () => {
      const savedMonths = localStorage.getItem('configuredMonths');
      const savedIsConfirmed = localStorage.getItem('monthsConfirmed');
      
      if (savedMonths) {
        setSelectedMonths(JSON.parse(savedMonths));
      }
      
      if (savedIsConfirmed) {
        setIsConfirmed(JSON.parse(savedIsConfirmed));
      }
    };
    
    setMonths(generateMonths());
    loadMonths();
  }, [currentUser, navigate]);

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
        // Limit to 3 months
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
    
    // Save to localStorage
    localStorage.setItem('configuredMonths', JSON.stringify(selectedMonths));
    localStorage.setItem('monthsConfirmed', JSON.stringify(true));
    
    setIsConfirmed(true);
    
    toast({
      title: "Success",
      description: "Months configured successfully",
    });
  };

  const handleEdit = () => {
    // In a real app, this would send an OTP to the admin's email
    // For demo purposes, we'll just show the OTP dialog with a fixed OTP
    const mockOtp = '123456';
    console.log('OTP for verification:', mockOtp);
    
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email",
    });
    
    setShowOtpDialog(true);
  };

  const handleVerifyOtp = () => {
    // In a real app, this would verify the OTP against what was sent
    // For demo purposes, we'll just check against our fixed OTP
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

  // Don't render anything if no current user (prevents flash before redirect)
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
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
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
