import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { RegisterForm } from "./components/RegisterForm";
import { Login } from "./components/Login";
import { Questions } from "./components/Questions";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return null; // Initial loading state
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={!isLoggedIn ? <RegisterForm /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/questions" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
            <Route path="/competition/:id" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <div>Profile Page (Coming Soon)</div> : <Navigate to="/login" />} />
            <Route path="/competitions" element={isLoggedIn ? <div>Competitions Page (Coming Soon)</div> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={isLoggedIn ? <div>Leaderboard (Coming Soon)</div> : <Navigate to="/login" />} />
            <Route path="/community-groups" element={isLoggedIn ? <div>Community Groups (Coming Soon)</div> : <Navigate to="/login" />} />
            <Route path="/contact" element={isLoggedIn ? <div>Contact (Coming Soon)</div> : <Navigate to="/login" />} />
            
            {/* Root route */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;