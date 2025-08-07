
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TradesmenSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create tradesman profile
    const tradesmanProfile = {
      ...formData,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      hourlyRate: `$${formData.hourlyRateMin}-${formData.hourlyRateMax}`,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      verified: false,
      available: true,
      userType: 'tradesman'
    };

    // Store in localStorage
    localStorage.setItem("vakaden_user", JSON.stringify({
      email: formData.email,
      name: formData.name,
      userType: 'tradesman'
    }));
    
    // Store tradesman profile
    const existingTradesmen = JSON.parse(localStorage.getItem("vakaden_tradesmen") || "[]");
    existingTradesmen.push(tradesmanProfile);
    localStorage.setItem("vakaden_tradesmen", JSON.stringify(existingTradesmen));
    
    navigate("/tradesman-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Vakaden</span>
          </div>
          <CardTitle>Join as a Tradesman</CardTitle>
          <CardDescription>
            Create your professional profile to connect with clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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
                  value={formData.profession}
                  onChange={handleChange}
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
                  value={formData.experience}
                  onChange={handleChange}
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
                value={formData.location}
                onChange={handleChange}
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
                  value={formData.hourlyRateMin}
                  onChange={handleChange}
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
                  value={formData.hourlyRateMax}
                  onChange={handleChange}
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
                value={formData.specialties}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications & Certifications</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                placeholder="List your licenses, certifications, and qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Professional Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of your services and approach"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Tradesman Profile
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Looking for tradesmen? </span>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up as a client
            </Link>
          </div>
          
          <div className="mt-2 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradesmenSignup;
