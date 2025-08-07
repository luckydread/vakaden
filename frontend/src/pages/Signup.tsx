import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Wrench, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";
import { setCookie } from "@/utils/cookie";

const Signup = () => {
  const [step, setStep] = useState<"choose" | "client" | "tradesman">("choose");
  const [clientData, setClientData] = useState({
    email: "",
    password: ""
  });
  const [tradesmanData, setTradesmanData] = useState({
    email: "",
    password: "",
    profession: "",
    experience: "",
    location: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    specialties: "",
    qualifications: "",
    description: ""
  });
  
  const navigate = useNavigate();

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleTradesmanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTradesmanData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await makeDjangoApiRequest({
        url: '/register',
        method: 'POST',
        data: {
          email: clientData.email,
          password: clientData.password,
          user_type: 'client'
        },
        skipAuth: true
      });
      
      if (response.error) {
        const errorMessage = response.data?.detail || response.data?.error || response.error;
        toast.error(errorMessage);
        console.error('Registration error:', response.data);
        return;
      }
      
      localStorage.setItem("user", JSON.stringify({ 
        email: clientData.email, 
        userType: 'client',
        token: response.data.token,
        id: response.data.id
      }));
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleTradesmanSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await makeDjangoApiRequest({
        url: '/register',
        method: 'POST',
        data: {
          email: tradesmanData.email,
          password: tradesmanData.password,
          user_type: 'tradesman',
          profession: tradesmanData.profession,
          hourly_rate_min: parseInt(tradesmanData.hourlyRateMin),
          hourly_rate_max: parseInt(tradesmanData.hourlyRateMax),
          qualifications: tradesmanData.qualifications,
          description: tradesmanData.description
        },
        skipAuth: true
      });
      
      if (response.error) {
        const errorMessage = response.data?.detail || response.data?.error || response.error;
        toast.error(errorMessage);
        console.error('Registration error:', response.data);
        return;
      }
      
      localStorage.setItem("user", JSON.stringify({
        email: tradesmanData.email,
        userType: 'tradesman',
        token: response.data.token,
        id: response.data.id
      }));
      
      navigate("/tradesman-dashboard");
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  if (step === "choose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Vakaden</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Vakaden</h1>
            <p className="text-gray-600">Choose how you want to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep("client")}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>I want to build my home</CardTitle>
                <CardDescription>
                  Find and hire qualified professionals for your building project
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">
                  Get Started as Client
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep("tradesman")}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>I'm a tradesman</CardTitle>
                <CardDescription>
                  Create your professional profile and connect with clients
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">
                  Get Started as Tradesman
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === "client") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Vakaden</span>
            </div>
            <CardTitle>Create Client Account</CardTitle>
            <CardDescription>
              Join as a client to find qualified tradesmen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClientSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={clientData.email}
                  onChange={handleClientChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">Password</Label>
                <Input
                  id="client-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={clientData.password}
                  onChange={handleClientChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => setStep("choose")}>
                ← Back to selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "tradesman") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Vakaden</span>
            </div>
            <CardTitle>Create Tradesman Profile</CardTitle>
            <CardDescription>
              Join as a tradesman to connect with clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTradesmanSignup} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tradesman-email">Email</Label>
                  <Input
                    id="tradesman-email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={tradesmanData.email}
                    onChange={handleTradesmanChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradesman-password">Password</Label>
                <Input
                  id="tradesman-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={tradesmanData.password}
                  onChange={handleTradesmanChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    name="profession"
                    type="text"
                    placeholder="e.g., Electrician, Plumber"
                    value={tradesmanData.profession}
                    onChange={handleTradesmanChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    placeholder="e.g., 15+ years"
                    value={tradesmanData.experience}
                    onChange={handleTradesmanChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Your service area"
                  value={tradesmanData.location}
                  onChange={handleTradesmanChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRateMin">Hourly Rate (Min $)</Label>
                  <Input
                    id="hourlyRateMin"
                    name="hourlyRateMin"
                    type="number"
                    placeholder="75"
                    value={tradesmanData.hourlyRateMin}
                    onChange={handleTradesmanChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRateMax">Hourly Rate (Max $)</Label>
                  <Input
                    id="hourlyRateMax"
                    name="hourlyRateMax"
                    type="number"
                    placeholder="120"
                    value={tradesmanData.hourlyRateMax}
                    onChange={handleTradesmanChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties (comma separated)</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  type="text"
                  placeholder="e.g., Residential Wiring, Panel Upgrades, Smart Home"
                  value={tradesmanData.specialties}
                  onChange={handleTradesmanChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications & Certifications</Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  placeholder="List your licenses, certifications, and qualifications"
                  value={tradesmanData.qualifications}
                  onChange={handleTradesmanChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Professional Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your services and approach"
                  value={tradesmanData.description}
                  onChange={handleTradesmanChange}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Tradesman Profile
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => setStep("choose")}>
                ← Back to selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Signup;