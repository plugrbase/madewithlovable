
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthConfirmation from "./pages/AuthConfirmation";
import SubmitProject from "./pages/SubmitProject";
import ProjectSubmitted from "./pages/ProjectSubmitted";
import Admin from "./pages/Admin";
import Project from "./pages/Project";
import NotFound from "./pages/NotFound";
import MyProjects from "./pages/MyProjects";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return null; // Loading state
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<Auth />} />
            <Route path="/auth/confirmation" element={<AuthConfirmation />} />
            <Route path="/project-submitted" element={<ProjectSubmitted />} />
            <Route path="/submit" element={<SubmitProject />} />
            <Route
              path="/my-projects"
              element={
                <PrivateRoute>
                  <MyProjects />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
