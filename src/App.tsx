
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
import Contact from "./pages/Contact";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={!isLoggedIn ? <RegisterForm /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sporting-clubs" element={<div>Sporting Clubs (Coming Soon)</div>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/questions" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
            <Route path="/competition/:id" element={isLoggedIn ? <Questions /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <div>Profile Page (Coming Soon)</div> : <Navigate to="/login" />} />
            <Route path="/competitions" element={isLoggedIn ? <div>Competitions Page (Coming Soon)</div> : <Navigate to="/login" />} />
            
            {/* Root route */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Index />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
