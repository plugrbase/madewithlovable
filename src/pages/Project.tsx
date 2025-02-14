
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
                </div>

                <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>

                <div className="pt-4 border-t">
                  <h2 className="text-sm text-gray-500 mb-2">Created by</h2>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{project.profiles.username || 'Anonymous'}</span>
                    {project.twitter_profile && (
                      <Button asChild variant="ghost" size="sm">
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectPage;
