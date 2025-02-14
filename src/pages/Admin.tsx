
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Project } from "@/types/admin";
import ProjectList from "@/components/admin/ProjectList";
import ProjectViewDialog from "@/components/admin/ProjectViewDialog";
import ProjectEditDialog from "@/components/admin/ProjectEditDialog";
import UserList from "@/components/admin/UserList";
import CategoryList from "@/components/admin/CategoryList";
import { useAdmin } from "@/hooks/use-admin";
import { useProjectManagement } from "@/hooks/use-project-management";
import { useUserManagement } from "@/hooks/use-user-management";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const {
    isAdmin,
    loading,
    projects,
    users,
    categories,
    setProjects,
    setUsers,
    fetchData,
  } = useAdmin();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const {
    handleImageUpload,
    toggleFeatured,
    toggleValidation,
    deleteProject,
  } = useProjectManagement(projects, setProjects);

  const {
    toggleUserRole,
    toggleUserDisable,
  } = useUserManagement(users, setUsers);

  const handleUpdateProject = async (updatedProject: Project, imageFile: File | null) => {
    let imageUrl = updatedProject.image_url;

    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile, updatedProject.id);
      if (!imageUrl) return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: updatedProject.title,
          description: updatedProject.description,
          short_description: updatedProject.short_description,
          website_url: updatedProject.website_url,
          github_url: updatedProject.github_url,
          twitter_profile: updatedProject.twitter_profile,
          image_url: imageUrl,
        })
        .eq('id', updatedProject.id);

      if (error) throw error;

      setProjects(projects.map(project =>
        project.id === updatedProject.id
          ? { ...updatedProject, image_url: imageUrl }
          : project
      ));

      setEditingProject(null);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="container max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects">
              <TabsList>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-6">
                <ProjectList
                  projects={projects}
                  onView={setSelectedProject}
                  onEdit={setEditingProject}
                  onToggleValidation={toggleValidation}
                  onToggleFeatured={toggleFeatured}
                  onDelete={deleteProject}
                />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <UserList
                  users={users}
                  onToggleRole={toggleUserRole}
                  onToggleDisable={toggleUserDisable}
                />
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <CategoryList
                  categories={categories}
                  onCategoryChange={fetchData}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ProjectViewDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onValidate={toggleValidation}
      />

      <ProjectEditDialog
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleUpdateProject}
      />
    </div>
  );
};

export default Admin;
