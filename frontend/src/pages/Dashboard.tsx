import { useState, useEffect } from 'react';
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";
import { getCookie } from "@/utils/cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, House, Plus, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const [userData, setUserData] = useState(null);
  
  // Redirect to login if not logged in
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  useEffect(() => {
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserData(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      // Make logout request with cookies
      await makeDjangoApiRequest({
        url: '/logout',
        method: "POST",
      });

      // Clean up tokens
      localStorage.removeItem('user');
      // Clear all cookies
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear tokens and redirect even if logout request fails
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Vakaden</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {userData?.email}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your house building projects and connect with professionals</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/house-plan-generator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <House className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Generate House Plan</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">Create AI-powered house plans</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/components">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">View material lists</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/marketplace">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Marketplace</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">Find tradesmen</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">New Project</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">Start a new build</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest house building projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Modern Family Home</h3>
                    <p className="text-sm text-gray-600">3 bed, 2 bath • Started 2 weeks ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Cozy Cottage</h3>
                    <p className="text-sm text-gray-600">2 bed, 1 bath • Started 1 month ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>Overview of your building progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plans Generated</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tradesmen Connected</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Savings</span>
                  <span className="font-semibold text-green-600">$12,500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
