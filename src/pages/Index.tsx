
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProjectCard from '@/components/ProjectCard';
import FeaturedProject from '@/components/FeaturedProject';
import NewsletterForm from '@/components/NewsletterForm';
import { Search, Filter, LogIn, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchProjects = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('validated', true)
    .or(`publish_date.lte.${now},publish_date.is.null`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const fetchFeaturedProject = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .eq('validated', true)
    .or(`publish_date.lte.${now},publish_date.is.null`)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: featuredProject } = useQuery({
    queryKey: ['featuredProject'],
    queryFn: fetchFeaturedProject,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const filteredProjects = projects.filter(project =>
    (selectedCategory ? project.tags?.includes(selectedCategory) : true) &&
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="min-h-screen bg-secondary">
      <section className="pt-6 pb-8 px-4 animate-fadeIn">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <img 
              src="/lovable-uploads/9102f3d4-a8bd-4d66-9ba7-bcd348cfeac2.png"
              alt="Made with Lovable Logo" 
              className="h-10"
            />
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Project
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Made with Lovable
            </h1>
            <p className="text-xl text-gray-600">
              A collection of projects made with Lovable
            </p>
          </div>
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                className="pl-10" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="max-w-4xl mx-auto mt-6 mb-12 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${!selectedCategory ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className={`rounded-full ${selectedCategory === category.name ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {featuredProject && (
        <section className="container mb-20">
          <h2 className="text-2xl font-semibold mb-6">Featured Project</h2>
          <FeaturedProject 
            title={featuredProject.title}
            description={featuredProject.description}
            imageUrl={featuredProject.image_url || "/placeholder.svg"}
            tags={featuredProject.tags}
            link={`/project/${featuredProject.id}`}
          />
        </section>
      )}

      <section className="container mb-20">
        <h2 className="text-2xl font-semibold mb-6">Latest Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              imageUrl={project.image_url || "/placeholder.svg"}
              tags={project.tags}
              views={project.views_count}
            />
          ))}
        </div>
      </section>

      <section className="container mb-20">
        <div className="max-w-xl mx-auto">
          <NewsletterForm />
        </div>
      </section>

      <footer className="bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-gray-600">
                Made with Lovable showcases the best projects built using the Lovable framework.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><Link to="/submit" className="hover:text-primary">Submit Project</Link></li>
                <li><a href="#" className="hover:text-primary">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
                <li><a href="#" className="hover:text-primary">GitHub</a></li>
                <li><a href="#" className="hover:text-primary">Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
