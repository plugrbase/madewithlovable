
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/admin";
import ProjectCard from "@/components/ProjectCard";

const MyProjects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles:profiles(username)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Projects</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="space-y-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            shortDescription={project.short_description}
            imageUrl={project.image_url || '/placeholder.svg'}
            tags={project.tags || []}
            views={project.views_count}
          />
        ))}
        {projects?.length === 0 && (
          <p className="text-gray-500">You haven't submitted any projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
