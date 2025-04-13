
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import { isValidEmail, getUserRole, saveUser } from '@/utils/authUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const dormOptions = ["Dhanshiri", "Chayaneer", "Moyurponkhi", "Dhrubotara", "Meghdut"];

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    dormName: '',
    roomNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the email is for a student or admin
    if (formData.email) {
      setIsStudent(formData.email.endsWith('@g.bracu.ac.bd'));
    }
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDormChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dormName: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate the form data
    const requiredFields = ['name', 'email', 'dormName', 'password', 'confirmPassword'];
    if (isStudent) {
      requiredFields.push('id', 'roomNumber');
    }

    if (requiredFields.some(field => !formData[field as keyof typeof formData])) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Please use a valid BRAC University email (@g.bracu.ac.bd for students, @bracu.ac.bd for administrators)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Determine user role based on email domain
    const role = getUserRole(formData.email);

    if (!role) {
      toast({
        title: "Error",
        description: "Invalid email domain",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Create the user object
    const userData = {
      ...formData,
      id: isStudent ? formData.id : 'N/A',
      roomNumber: isStudent ? formData.roomNumber : 'N/A',
      role,
    };

    // Save user
    setTimeout(() => {
      try {
        saveUser({
          name: userData.name,
          id: userData.id,
          email: userData.email,
          dormName: userData.dormName,
          roomNumber: userData.roomNumber,
          password: userData.password,
          role,
        });

        toast({
          title: "Success",
          description: "Your account has been created successfully!",
        });

        // Redirect to login page
        navigate('/');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulating network request
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-tripti-light">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your details to sign up for TRIPTI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {isStudent && (
                  <div className="space-y-2">
                    <Label htmlFor="id">Student ID</Label>
                    <Input
                      id="id"
                      name="id"
                      placeholder="20301XXX"
                      value={formData.id}
                      onChange={handleChange}
                      required={isStudent}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@bracu.ac.bd or you@g.bracu.ac.bd"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Students: use @g.bracu.ac.bd | Administrators: use @bracu.ac.bd
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dormName">Dorm Name</Label>
                  <Select 
                    value={formData.dormName} 
                    onValueChange={handleDormChange}
                  >
                    <SelectTrigger id="dormName" className="w-full">
                      <SelectValue placeholder="Select a dorm" />
                    </SelectTrigger>
                    <SelectContent>
                      {dormOptions.map((dorm) => (
                        <SelectItem key={dorm} value={dorm}>
                          {dorm}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {isStudent && (
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      name="roomNumber"
                      placeholder="N-100 to N-1016"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required={isStudent}
                    />
                    <p className="text-xs text-gray-500">
                      Valid format: N-100 to N-1016
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/" className="text-tripti-primary hover:text-tripti-dark font-medium">
                  Sign in
                </Link>
              </p>
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

export default SignUp;
