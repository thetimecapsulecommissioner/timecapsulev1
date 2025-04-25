import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import { RegisterForm } from "./components/RegisterForm";
import { Login } from "./components/Login";
import { ResetPassword } from "./components/ResetPassword";
import { NewPassword } from "./components/NewPassword";
import { Questions } from "./components/Questions";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SportingClubs from "./pages/SportingClubs";
import Profile from "./pages/Profile";
import Competitions from "./pages/Competitions";
import FAQ from "./pages/FAQ";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserActivity from "./pages/AdminUserActivity";
import AdminTemplatesPage from "./components/admin/competition-templates/AdminTemplatesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={!isLoggedIn ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!isLoggedIn ? <ResetPassword /> : <Navigate to="/dashboard" />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/sporting-clubs" element={<SportingClubs />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/questions" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
      <Route path="/competition/:id" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/competitions" element={isLoggedIn ? <Competitions /> : <Navigate to="/login" />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/competitions" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/templates" element={isLoggedIn ? <AdminTemplatesPage /> : <Navigate to="/login" />} />
      <Route path="/admin/administrators" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/user-activity" element={isLoggedIn ? <AdminUserActivity /> : <Navigate to="/login" />} />
      
      {/* Root route */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Index />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
