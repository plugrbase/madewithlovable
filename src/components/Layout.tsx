
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-4 right-[calc(2rem+3rem)] z-50">
        {isLoggedIn ? (
          <Button
            variant="outline"
            size="default"
            onClick={handleLogout}
            className="border-gray-200"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="default"
            onClick={handleLogin}
            className="border-gray-200"
          >
            <LogIn className="h-5 w-5" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Layout;
