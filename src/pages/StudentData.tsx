
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import { getCurrentUser, getUsers, logoutUser } from '@/utils/authUtils';
import { LogOut, Search, Users } from 'lucide-react';

type StudentData = {
  name: string;
  id: string;
  email: string;
  roomNumber: string;
  tokensUsed: number;
  tokensAvailable: number;
};

const StudentData = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Generate mock student data based on registered users
    const users = getUsers();
    const students = users
      .filter(user => user.role === 'student')
      .map(user => ({
        name: user.name,
        id: user.id,
        email: user.email,
        roomNumber: user.roomNumber,
        tokensUsed: Math.floor(Math.random() * 5),
        tokensAvailable: Math.floor(Math.random() * 10) + 1,
      }));
    
    setStudentData(students);
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const filteredStudents = studentData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render anything if no current user (prevents flash before redirect)
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
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                {studentData.reduce((sum, student) => sum + student.tokensUsed, 0)}
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
                {studentData.reduce((sum, student) => sum + student.tokensAvailable, 0)}
              </div>
              <p className="text-sm text-gray-500">Ready to be used</p>
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
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Name</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">ID</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Email</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Room</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Tokens Used</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">{student.name}</td>
                        <td className="py-3 px-2">{student.id}</td>
                        <td className="py-3 px-2">{student.email}</td>
                        <td className="py-3 px-2">{student.roomNumber}</td>
                        <td className="py-3 px-2">{student.tokensUsed}</td>
                        <td className="py-3 px-2">{student.tokensAvailable}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        {searchTerm 
                          ? "No students found matching your search" 
                          : "No students registered yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
