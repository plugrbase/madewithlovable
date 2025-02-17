
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <section className="pt-20 pb-8 px-4 animate-fadeIn">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Made with Lovable
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A collection of projects made with Lovable
            </p>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link to="/submit">
                <Plus className="mr-2 h-4 w-4" />
                Submit Project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex-grow" />
      <Footer />
    </div>
  );
};

export default Index;
