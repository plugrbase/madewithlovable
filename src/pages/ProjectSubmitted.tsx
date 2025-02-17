
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProjectSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Project Submitted Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your submission. Your project is now pending review. We'll notify you once it's approved.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate("/")}>
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate("/submit")}>
            Submit Another Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmitted;
