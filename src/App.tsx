import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from './integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Account } from './components/Account'
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import { Login } from './components/Login';
import { Competitions } from './pages/Competitions';
import { Toaster } from "@/components/ui/toaster"
import AdminDashboard from './pages/AdminDashboard';
import AdminUserActivity from "./pages/AdminUserActivity";

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/dashboard"
          element={session ? <Dashboard session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/competitions"
          element={session ? <Competitions session={session} /> : <Navigate to="/login" />}
        />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/competitions" element={<AdminDashboard />} />
        <Route path="/admin/administrators" element={<AdminDashboard />} />
        <Route path="/admin/user-activity" element={<AdminUserActivity />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
