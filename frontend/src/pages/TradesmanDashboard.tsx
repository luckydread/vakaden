
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, User, Edit, Save, MessageSquare, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TradesmanDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'tradesman') {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);

    // Find tradesman profile
    const tradesmen = JSON.parse(localStorage.getItem("tradesmen") || "[]");
    const tradesmanProfile = tradesmen.find((t: any) => t.email === parsedUser.email);
    if (tradesmanProfile) {
      setProfile(tradesmanProfile);
      setEditForm(tradesmanProfile);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update profile in localStorage
    const tradesmen = JSON.parse(localStorage.getItem("tradesmen") || "[]");
    const updatedTradesmen = tradesmen.map((t: any) => 
      t.email === user.email ? { ...editForm, specialties: editForm.specialties.split(',').map((s: string) => s.trim()) } : t
    );
    localStorage.setItem("tradesmen", JSON.stringify(updatedTradesmen));
    
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

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
              <Link to="/marketplace">
                <Button variant="ghost">View Marketplace</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tradesman Dashboard</h1>
          <p className="text-gray-600">Manage your professional profile and view opportunities</p>
        </div>

        {/* Profile Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>Your public profile information</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          name="profession"
                          value={editForm.profession}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          value={editForm.experience}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={editForm.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialties">Specialties (comma separated)</Label>
                      <Input
                        id="specialties"
                        name="specialties"
                        value={Array.isArray(editForm.specialties) ? editForm.specialties.join(', ') : editForm.specialties}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{profile.name}</h3>
                        <p className="text-gray-600">{profile.profession}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={profile.verified ? "default" : "secondary"}>
                            {profile.verified ? "Verified" : "Pending Verification"}
                          </Badge>
                          <Badge variant={profile.available ? "default" : "secondary"}>
                            {profile.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-semibold">{profile.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold">{profile.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hourly Rate</p>
                        <p className="font-semibold">{profile.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{profile.rating || "New"}</span>
                          <span className="text-sm text-gray-600">({profile.reviews || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {(profile.specialties || []).map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {profile.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Description</p>
                        <p className="text-gray-800">{profile.description}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.reviews || 0}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Pending Inquiries</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-gray-600 text-sm">View and respond to client inquiries</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">My Projects</h3>
              <p className="text-gray-600 text-sm">Manage ongoing and completed projects</p>
            </CardContent>
          </Card>

          <Link to="/marketplace">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Browse Opportunities</h3>
                <p className="text-gray-600 text-sm">Find new clients and projects</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TradesmanDashboard;
