
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export const useProjectManagement = (
  projects: Project[],
  setProjects: (projects: Project[]) => void,
) => {
  const { toast } = useToast();

  const handleImageUpload = async (file: File, projectId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${projectId}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const toggleFeatured = async (projectId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: !currentStatus })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, is_featured: !currentStatus }
          : project
      ));

      toast({
        title: "Success",
        description: `Project ${currentStatus ? 'unfeatured' : 'featured'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleValidation = async (projectId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ validated: !currentStatus })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, validated: !currentStatus }
          : project
      ));

      toast({
        title: "Success",
        description: `Project ${currentStatus ? 'unvalidated' : 'validated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    handleImageUpload,
    toggleFeatured,
    toggleValidation,
    deleteProject,
  };
};
