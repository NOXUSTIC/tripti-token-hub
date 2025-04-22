
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import { getCurrentUser, logoutUser } from '@/utils/authUtils';
import { LogOut, Search, Users, Calendar, Utensils, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudents, getTokensByStudent } from "@/utils/localDatabase";
import { getTotalTokens, getUsedTokens, getRemainingTokens } from "@/utils/tokenUtils";

type StudentData = {
  name: string;
  id: string;
  email: string;
  roomNumber: string;
  tokensUsed: number;
  tokensAvailable: number;
};

type FoodStats = {
  chicken: number;
  beef: number;
  mutton: number;
  fish: number;
};

const StudentData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [foodStats, setFoodStats] = useState<FoodStats>({
    chicken: 0,
    beef: 0,
    mutton: 0,
    fish: 0
  });
  
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    toast({
      title: "Welcome Admin",
      description: "You're logged in to the admin dashboard"
    });
    
    loadStudentData();
  }, [currentUser, navigate]);
  
  const loadStudentData = () => {
    // Get fresh data from localStorage
    const students = getStudents();
    
    const configuredMonths = JSON.parse(localStorage.getItem('configuredMonths') || '[]');
    const currentMonth = configuredMonths.length > 0 ? configuredMonths[0] : '';
    
    // Get all tokens for all students, not just filtered by month
    const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
    const allTokens = db.tokens || [];
    
    const total = getTotalTokens();
    const used = allTokens.length; // Count all tokens, not filtered by month
    const remaining = total - used;
    
    setTotalTokens(total);
    setTotalTokensUsed(used);
    setRemainingTokens(remaining);
    
    const foodCounts = {
      chicken: 0,
      beef: 0,
      mutton: 0,
      fish: 0
    } as FoodStats;
    
    // Count food preferences from all tokens
    allTokens.forEach((token: any) => {
      if (token.foodType && foodCounts[token.foodType as keyof FoodStats] !== undefined) {
        foodCounts[token.foodType as keyof FoodStats]++;
      }
    });
    
    setFoodStats(foodCounts);
    
    const studentDataList = students.map(student => {
      const studentTokens = getTokensByStudent(student.id);
      const tokensUsedByStudent = studentTokens.length;
      
      const tokensAvailable = Math.max(0, Math.floor(total / (students.length || 1)) - tokensUsedByStudent);
      
      return {
        name: student.name,
        id: student.id,
        email: student.email,
        roomNumber: student.roomNumber,
        tokensUsed: tokensUsedByStudent,
        tokensAvailable: remaining,
      };
    });
    
    setStudentData(studentDataList);
  };

  const handleRefresh = () => {
    loadStudentData();
    toast({
      title: "Data Refreshed",
      description: "Student data has been refreshed"
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You've been logged out successfully"
    });
    
    logoutUser();
    navigate('/');
  };

  const filteredStudents = studentData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-tripti-dark">Student Data Management</h1>
            <p className="text-gray-600">Manage students and their token allocations</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="default"
              className="flex items-center gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button 
              variant="default"
              className="flex items-center gap-2"
              onClick={() => navigate('/month-configuration')}
            >
              <Calendar className="h-4 w-4" />
              Configure Months
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Students</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Users className="h-8 w-8 text-tripti-primary mr-3" />
              <div>
                <div className="text-3xl font-bold">{studentData.length}</div>
                <p className="text-sm text-gray-500">Registered students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tokens Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {totalTokensUsed}
              </div>
              <p className="text-sm text-gray-500">Across all students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {remainingTokens}
              </div>
              <p className="text-sm text-gray-500">Ready to be used</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-tripti-primary">
                {totalTokens}
              </div>
              <p className="text-sm text-gray-500">Weekly token capacity</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chicken Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Utensils className="h-8 w-8 text-tripti-primary mr-3" />
              <div>
                <div className="text-3xl font-bold">{foodStats.chicken}</div>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Beef Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Utensils className="h-8 w-8 text-tripti-primary mr-3" />
              <div>
                <div className="text-3xl font-bold">{foodStats.beef}</div>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mutton Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Utensils className="h-8 w-8 text-tripti-primary mr-3" />
              <div>
                <div className="text-3xl font-bold">{foodStats.mutton}</div>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fish Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Utensils className="h-8 w-8 text-tripti-primary mr-3" />
              <div>
                <div className="text-3xl font-bold">{foodStats.fish}</div>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
            <CardDescription>
              View and manage all registered student accounts
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Tokens Used</TableHead>
                    <TableHead>Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.roomNumber}</TableCell>
                        <TableCell>{student.tokensUsed}</TableCell>
                        <TableCell>{student.tokensAvailable}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        {searchTerm 
                          ? "No students found matching your search" 
                          : "No students registered yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-auto py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TRIPTI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StudentData;
