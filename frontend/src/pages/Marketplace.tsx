import { useState, useEffect } from "react";
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, User } from "lucide-react";
import { Link } from "react-router-dom";
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";
import { toast } from "react-toastify";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tradesmen, setTradesmen] = useState<any[]>([]);

  useEffect(() => {
    // Load tradesmen from localStorage
    const storedTradesmen = JSON.parse(localStorage.getItem("vakaden_tradesmen") || "[]");
    
    // Default tradesmen data if none exist
    const defaultTradesmen = [
      {
        id: 1,
        name: "John Smith",
        profession: "Electrician",
        rating: 4.9,
        reviews: 127,
        experience: "15+ years",
        location: "Downtown Area",
        hourlyRate: "$85-120",
        specialties: ["Residential Wiring", "Panel Upgrades", "Smart Home"],
        verified: true,
        available: true
      },
      {
        id: 2,
        name: "Mike Rodriguez",
        profession: "Plumber",
        rating: 4.8,
        reviews: 89,
        experience: "12+ years",
        location: "North Side",
        hourlyRate: "$75-110",
        specialties: ["Pipe Installation", "Bathroom Remodeling", "Water Heaters"],
        verified: true,
        available: true
      }
    ];

    // Combine stored and default tradesmen, then filter to only show verified ones
    const allTradesmen = [...defaultTradesmen, ...storedTradesmen];
    const verifiedTradesmen = allTradesmen.filter(tradesman => tradesman.verified === true);
    setTradesmen(verifiedTradesmen);
  }, []);

  const categories = ["all", "electricians", "plumbers", "builders", "roofers", "painters"];

  const filteredTradesmen = tradesmen.filter(tradesman => {
    const matchesSearch = 
      (tradesman.name?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false) ||
      (tradesman.profession?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false) ||
      (tradesman.specialties && 
        (Array.isArray(tradesman.specialties) 
          ? tradesman.specialties.some(specialty => 
              specialty?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false)
          : tradesman.specialties?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false));
    
    const matchesCategory = selectedCategory === "all" || 
      (tradesman.profession === selectedCategory || 
        (tradesman.specialties && 
          (Array.isArray(tradesman.specialties) 
            ? tradesman.specialties.includes(selectedCategory)
            : tradesman.specialties?.toLowerCase?.()?.includes(selectedCategory.toLowerCase()) ?? false)));
    
    return matchesSearch && matchesCategory;
  });

  if (tradesmen.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Loading tradesmen...</h3>
        </div>
      </div>
    );
  }

  if (tradesmen.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="mx-auto h-12 w-12 text-red-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No tradesmen found</h3>
        </div>
      </div>
    );
  }

  if (tradesmen.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No tradesmen found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Vakaden</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tradesman Marketplace</h1>
          <p className="text-gray-600">Connect with verified professionals for your building project</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredTradesmen.length}</div>
              <div className="text-sm text-gray-600">Approved Professionals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTradesmen.filter(t => t.available).length}
              </div>
              <div className="text-sm text-gray-600">Currently Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Verified Professionals</div>
            </CardContent>
          </Card>
        </div>

        {/* Tradesmen Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTradesmen.map((tradesman, index) => (
            <Card key={`${tradesman.id}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tradesman.name}</CardTitle>
                      <CardDescription>{tradesman.profession}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                    <Badge variant={tradesman.available ? "default" : "secondary"}>
                      {tradesman.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">{tradesman.rating || "New"}</span>
                        {tradesman.rating && <span className="text-yellow-500">★★★★★</span>}
                        <span className="text-sm text-gray-600">({tradesman.reviews || 0} reviews)</span>
                      </div>
                      <p className="text-sm text-gray-600">{tradesman.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{tradesman.hourlyRate}</p>
                      <p className="text-sm text-gray-600">per hour</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">📍 {tradesman.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {(tradesman.specialties || []).map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tradesman.verified && (
                      <Badge variant="outline">Verified</Badge>
                    )}
                    {tradesman.available ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="destructive">Not Available</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
