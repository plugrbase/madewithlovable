
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AuthConfirmation = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account and complete the sign up process.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/auth">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirmation;
