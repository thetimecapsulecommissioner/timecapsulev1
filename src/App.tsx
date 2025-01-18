import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { RegisterForm } from "./components/RegisterForm";
import { Login } from "./components/Login";
import { Questions } from "./components/Questions";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
          <Route path="/competitions" element={<div>Competitions Page (Coming Soon)</div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;