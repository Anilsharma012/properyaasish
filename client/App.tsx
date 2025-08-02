import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Properties from "./pages/Properties";
import Chat from "./pages/Chat";
import MyAccount from "./pages/MyAccount";
import Agents from "./pages/Agents";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import EnhancedUserLogin from "./pages/EnhancedUserLogin";
import SimpleLogin from "./pages/SimpleLogin";
import ComprehensiveAuth from "./pages/ComprehensiveAuth";
import UserDashboard from "./pages/UserDashboard";
import PostProperty from "./pages/PostProperty";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import CategoryProperties from "./pages/CategoryProperties";
import PropertyDetail from "./pages/PropertyDetail";
import ContentPage from "./pages/ContentPage";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffAdmin from "./pages/StaffAdmin";
import EnhancedSellerDashboard from "./pages/EnhancedSellerDashboard";
import NotFound from "./pages/NotFound";
import FooterTest from "./pages/FooterTest";
import NetworkStatus from "./components/NetworkStatus";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NetworkStatus />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/categories/:category"
                element={<CategoryProperties />}
              />
              <Route
                path="/categories/:category/:subcategory"
                element={<CategoryProperties />}
              />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-login" element={<EnhancedUserLogin />} />
              <Route path="/simple-login" element={<SimpleLogin />} />
              <Route path="/auth" element={<ComprehensiveAuth />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/enhanced-seller-dashboard" element={<EnhancedSellerDashboard />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/staff-admin" element={<StaffAdmin />} />
              {/* Content Pages */}
              <Route path="/about-us" element={<ContentPage />} />
              <Route path="/privacy-policy" element={<ContentPage />} />
              <Route path="/terms-conditions" element={<ContentPage />} />
              <Route path="/refund-policy" element={<ContentPage />} />
              <Route path="/contact-us" element={<ContentPage />} />
              {/* Footer Test Page */}
              <Route path="/footer-test" element={<FooterTest />} />
              <Route path="/:slug" element={<ContentPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
