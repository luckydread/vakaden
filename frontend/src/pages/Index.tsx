
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, House, User, Store } from "lucide-react";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";

const Index = () => {
  const response = makeDjangoApiRequest({
    url: "/",
    method: "GET"
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Vakadeny</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Dream Home
            <span className="block text-blue-600">With AI-Powered Planning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From AI-generated house plans to component calculations and tradesman connections -
            manage your entire house building process in one powerful platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3">
                Start Building
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform streamlines every aspect of house construction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <House className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>AI House Plans</CardTitle>
                <CardDescription>
                  Generate custom house plans using advanced AI technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Custom room layouts</li>
                  <li>• 3D visualizations</li>
                  <li>• Instant modifications</li>
                  <li>• Export to CAD</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Component Calculator</CardTitle>
                <CardDescription>
                  Automatically calculate all materials needed for construction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Precise material counts</li>
                  <li>• Cost estimations</li>
                  <li>• Supplier connections</li>
                  <li>• Waste minimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Tradesman Marketplace</CardTitle>
                <CardDescription>
                  Connect with qualified electricians, plumbers, and builders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Verified professionals</li>
                  <li>• Reviews & ratings</li>
                  <li>• Direct messaging</li>
                  <li>• Project matching</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of homeowners who have successfully built their dream homes with Vakaden
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6" />
              <span className="text-lg font-semibold">Vakaden</span>
            </div>
            <p className="text-gray-400">© 2024 Vakaden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
