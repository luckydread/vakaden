
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { Link } from "react-router-dom";

const Components = () => {
  const componentCategories = [
    {
      category: "Foundation & Structure",
      items: [
        { name: "Concrete", quantity: "45 cubic yards", cost: "$6,750" },
        { name: "Rebar", quantity: "2,400 lbs", cost: "$1,680" },
        { name: "Lumber (2x4)", quantity: "120 pieces", cost: "$840" },
        { name: "Lumber (2x6)", quantity: "80 pieces", cost: "$720" },
        { name: "Steel Beams", quantity: "8 pieces", cost: "$3,200" },
      ]
    },
    {
      category: "Exterior Materials",
      items: [
        { name: "Bricks", quantity: "8,500 pieces", cost: "$4,250" },
        { name: "Roof Tiles", quantity: "2,200 sq ft", cost: "$6,600" },
        { name: "Windows", quantity: "12 units", cost: "$7,200" },
        { name: "Exterior Doors", quantity: "2 units", cost: "$1,800" },
        { name: "Siding", quantity: "1,800 sq ft", cost: "$5,400" },
      ]
    },
    {
      category: "Interior Materials",
      items: [
        { name: "Drywall", quantity: "3,200 sq ft", cost: "$1,920" },
        { name: "Flooring (Hardwood)", quantity: "1,200 sq ft", cost: "$7,200" },
        { name: "Flooring (Tile)", quantity: "600 sq ft", cost: "$3,600" },
        { name: "Interior Doors", quantity: "8 units", cost: "$2,400" },
        { name: "Trim & Molding", quantity: "800 linear ft", cost: "$1,200" },
      ]
    },
    {
      category: "Plumbing",
      items: [
        { name: "PVC Pipes", quantity: "400 linear ft", cost: "$800" },
        { name: "Copper Pipes", quantity: "200 linear ft", cost: "$1,400" },
        { name: "Fixtures Set", quantity: "1 complete set", cost: "$3,500" },
        { name: "Water Heater", quantity: "1 unit", cost: "$1,200" },
        { name: "Shut-off Valves", quantity: "15 pieces", cost: "$450" },
      ]
    },
    {
      category: "Electrical",
      items: [
        { name: "Electrical Wire", quantity: "2,000 ft", cost: "$800" },
        { name: "Outlets & Switches", quantity: "45 pieces", cost: "$675" },
        { name: "Circuit Breakers", quantity: "20 pieces", cost: "$600" },
        { name: "Light Fixtures", quantity: "15 pieces", cost: "$2,250" },
        { name: "Electrical Panel", quantity: "1 unit", cost: "$800" },
      ]
    }
  ];

  const totalCost = componentCategories.reduce((total, category) => 
    total + category.items.reduce((categoryTotal, item) => 
      categoryTotal + parseFloat(item.cost.replace('$', '').replace(',', '')), 0), 0
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Component List</h1>
          <p className="text-gray-600">Complete material breakdown for your house plan</p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
            <CardDescription>Modern Family Home - 3 bed, 2 bath</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{componentCategories.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {componentCategories.reduce((total, cat) => total + cat.items.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">${totalCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Estimated Cost</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-sm text-gray-600">Cost Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Categories */}
        <div className="space-y-6">
          {componentCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <CardDescription>
                  {category.items.length} items • ${category.items.reduce((total, item) => 
                    total + parseFloat(item.cost.replace('$', '').replace(',', '')), 0
                  ).toLocaleString()} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Material</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-right p-2">Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-gray-100">
                          <td className="p-2 font-medium">{item.name}</td>
                          <td className="p-2 text-gray-600">{item.quantity}</td>
                          <td className="p-2 text-right font-semibold">{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg">Export to PDF</Button>
          <Button variant="outline" size="lg">Share with Contractors</Button>
          <Button variant="outline" size="lg">Find Suppliers</Button>
          <Link to="/marketplace">
            <Button variant="outline" size="lg">Find Tradesmen</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Components;
