import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TradesmenSignup from "./pages/TradesmenSignup";
import Dashboard from "./pages/Dashboard";
import TradesmanDashboard from "./pages/TradesmanDashboard";
import HousePlanGenerator from "./pages/HousePlanGenerator";
import Components from "./pages/Components";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tradesman-signup" element={<TradesmenSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tradesman-dashboard" element={<TradesmanDashboard />} />
          <Route path="/house-plan-generator" element={<HousePlanGenerator />} />
          <Route path="/components" element={<Components />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
