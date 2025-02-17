
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/ProjectCard";
import NewsletterForm from "@/components/NewsletterForm";

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  website_url: string | null;
  twitter_profile: string | null;
  profiles: {
    username: string | null;
  };
}

interface RelatedProject {
  id: string;
  title: string;
  description: string;
  short_description: string | null;
  image_url: string | null;
  tags: string[] | null;
  views_count: number;
}

const ProjectPage = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          image_url,
          website_url,
          twitter_profile,
          profiles (
            username
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ProjectDetails;
    },
  });

  const { data: relatedProjects = [] } = useQuery({
    queryKey: ['related-projects', id],
    queryFn: async () => {
      // First get the categories of the current project
      const { data: projectCategories } = await supabase
        .from('project_categories')
        .select('category_id')
        .eq('project_id', id);

      if (!projectCategories?.length) {
        // If no categories, just get random projects
        const { data } = await supabase
          .from('projects')
          .select('id, title, description, short_description, image_url, tags, views_count')
          .neq('id', id)
          .eq('validated', true)
          .limit(6)
          .order('created_at', { ascending: false });
        return data as RelatedProject[];
      }

      // Get projects that share categories
      const categoryIds = projectCategories.map(pc => pc.category_id);
      const { data: relatedProjectIds } = await supabase
        .from('project_categories')
        .select('project_id')
        .in('category_id', categoryIds)
        .neq('project_id', id);

      if (!relatedProjectIds?.length) return [];

      const uniqueProjectIds = [...new Set(relatedProjectIds.map(p => p.project_id))];
      const { data } = await supabase
        .from('projects')
        .select('id, title, description, short_description, image_url, tags, views_count')
        .in('id', uniqueProjectIds)
        .eq('validated', true)
        .limit(6)
        .order('created_at', { ascending: false });

      return data as RelatedProject[];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container py-12">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container py-12">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 mb-8 block">
          ← Back to projects
        </Link>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {project.image_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                
                <div className="flex flex-wrap gap-4">
                  {project.website_url && (
                    <Button asChild variant="outline">
                      <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  {project.twitter_profile && (
                    <Button asChild variant="outline">
                      <a 
                        href={`https://twitter.com/${project.twitter_profile}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        @{project.twitter_profile}
                      </a>
                    </Button>
                  )}
                </div>

                <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  shortDescription={project.short_description}
                  imageUrl={project.image_url || '/placeholder.svg'}
                  tags={project.tags}
                  views={project.views_count}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/">
              View All Projects
            </Link>
          </Button>
        </div>

        <div className="mt-24">
          <NewsletterForm />
        </div>
      </div>

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
                <li><Link to="/submit" className="hover:text-primary">Submit Project</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://x.com/JulienLeg78" className="hover:text-primary">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPage;
