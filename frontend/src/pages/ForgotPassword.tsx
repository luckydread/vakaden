import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { makeDjangoApiRequest } from "@/components/DjangoApiClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Password reset instructions sent!");
  const notifyError = () => toast.error("Failed to send password reset instructions.");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Clear any existing auth token since we don't need it for password reset
      localStorage.removeItem('access_token');

      const response = await makeDjangoApiRequest({
        url: "/password-reset",
        method: "POST",
        data: { email },
        headers: {
          'Authorization': '' // Clear any existing auth header
        }
      });

      if (response.error) {
        notifyError();
        return;
      }

      notifySuccess();
      // Navigate back to login after successful request
      navigate("/login");
    } catch (error) {
      notifyError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
