import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from "@/integrations/supabase/client";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { AuthWrapper } from "./components/AuthWrapper";
import { Dashboard } from "./components/Dashboard";
import { ResetPassword } from "./components/ResetPassword";
import { UpdatePassword } from "./components/UpdatePassword";
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";
import { Home } from "./components/Home";
import { Pricing } from "./components/Pricing";
import { Contact } from "./components/Contact";
import { Questions } from "./components/questions/Questions";
import { Competition } from "./components/competition/Competition";

function App() {
  const location = useLocation();
  
  // Track page views whenever the route changes
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/" element={<Home />} />
      <Route path="/competition/:competitionId" element={<Competition />} />

      <Route
        path="/dashboard"
        element={
          <AuthWrapper>
            <Dashboard />
          </AuthWrapper>
        }
      />
      <Route
        path="/questions"
        element={
          <AuthWrapper>
            <Questions />
          </AuthWrapper>
        }
      />
    </Routes>
  );
}

export default App;
