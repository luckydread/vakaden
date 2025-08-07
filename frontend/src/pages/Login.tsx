import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Login successful!");
  const notifyError = () => toast.error("Login failed!");
  const notifyInfo = () => toast.info("This is an info message.");
  const notifyWarning = () => toast.warn("This is a warning message.");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    try {
      const response = await makeDjangoApiRequest({
        url: '/login',
        method: "POST",
        data: { email, password },
        skipAuth: true // Skip authentication for login request
      });

      console.log('Login response:', response);

      if (response.error) {
        // Try to extract detailed error message
        const errorMessage = response.error;
        notifyError();
        
        // Show detailed error if available
        if (response.data?.detail) {
          toast.error(`Server details: ${response.data.detail}`);
        }
        return;
      }

      // Store user info in localStorage
      if (response.data) {
        // After successful login
        const { access, refresh, is_tradesman } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('is_tradesman', is_tradesman);

        // Store user info
        localStorage.setItem('user', JSON.stringify({
          ...response.data,
          access_token: access
        }));
        
        notifySuccess();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const redirectPath = user.is_tradesman ? "/tradesman-dashboard" : "/dashboard";
        navigate(redirectPath, { replace: true });
      } else {
        notifyError();
      }
    } catch (error) {
      notifyError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Vakaden</span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Vakaden account to continue building
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
