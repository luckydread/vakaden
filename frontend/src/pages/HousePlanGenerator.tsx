
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, House, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const HousePlanGenerator = () => {
  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    style: "",
    budget: "",
    specialRequirements: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPlan(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BuildPro</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI House Plan Generator</h1>
          <p className="text-gray-600">Create custom house plans tailored to your needs using advanced AI</p>
        </div>

        {!generatedPlan ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <House className="h-6 w-6" />
                <span>House Requirements</span>
              </CardTitle>
              <CardDescription>
                Tell us about your dream home and we'll generate a custom plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => setFormData({...formData, bedrooms: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => setFormData({...formData, bathrooms: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                        <SelectItem value="3">3+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      placeholder="e.g., 2000"
                      value={formData.squareFootage}
                      onChange={(e) => setFormData({...formData, squareFootage: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Architectural Style</Label>
                    <Select value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="colonial">Colonial</SelectItem>
                        <SelectItem value="craftsman">Craftsman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100-200k">$100,000 - $200,000</SelectItem>
                        <SelectItem value="200-300k">$200,000 - $300,000</SelectItem>
                        <SelectItem value="300-500k">$300,000 - $500,000</SelectItem>
                        <SelectItem value="500k+">$500,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Describe any special features you'd like (e.g., home office, large kitchen, garage, etc.)"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating Your House Plan...</span>
                    </div>
                  ) : (
                    <>Generate House Plan</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Plan Generated Successfully!</CardTitle>
                <CardDescription>
                  Your custom house plan has been created based on your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                  <House className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">3D House Plan Preview</p>
                  <p className="text-sm text-gray-500 mt-2">Interactive 3D model would be displayed here</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Plan Details</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• {formData.bedrooms} Bedrooms</li>
                      <li>• {formData.bathrooms} Bathrooms</li>
                      <li>• {formData.squareFootage} sq ft</li>
                      <li>• {formData.style} Style</li>
                      <li>• Open floor plan design</li>
                      <li>• Energy-efficient layout</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Features Included</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Master suite with walk-in closet</li>
                      <li>• Modern kitchen with island</li>
                      <li>• Covered front porch</li>
                      <li>• Laundry room</li>
                      <li>• Two-car garage</li>
                      <li>• Storage solutions</li>
                    </ul>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button>Download Plans</Button>
                  <Link to="/components">
                    <Button variant="outline">View Components</Button>
                  </Link>
                  <Button variant="outline">Modify Plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HousePlanGenerator;
