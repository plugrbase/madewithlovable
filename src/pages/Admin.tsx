
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Star, StarOff, Trash2, Eye, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  website_url: string | null;
  github_url: string | null;
  twitter_profile: string | null;
  tags: string[] | null;
  is_featured: boolean;
  validated: boolean;
  views_count: number;
  profiles: { username: string | null };
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    } else {
      setIsAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    if (!window.confirm(`Are you sure you want to ${currentRole === 'admin' ? 'remove' : 'grant'} admin rights?`)) return;

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: "Success",
        description: `User role updated successfully`,
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
              </TabsList>

              <TabsContent value="projects" className="mt-6">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,1fr,auto] gap-4 p-4 font-medium">
                    <div>Title</div>
                    <div>Author</div>
                    <div>Actions</div>
                  </div>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-[1fr,1fr,auto] gap-4 border-t p-4"
                    >
                      <div className="flex items-center gap-2">
                        {project.title}
                        {project.validated && (
                          <Badge variant="secondary" className="text-xs">
                            Validated
                          </Badge>
                        )}
                      </div>
                      <div>{project.profiles?.username || 'Anonymous'}</div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleValidation(project.id, project.validated)}
                        >
                          <Check className={`h-4 w-4 ${project.validated ? 'text-green-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeatured(project.id, project.is_featured)}
                        >
                          {project.is_featured ? (
                            <StarOff className="h-4 w-4" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,1fr,auto] gap-4 p-4 font-medium">
                    <div>Username</div>
                    <div>Role</div>
                    <div>Actions</div>
                  </div>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-[1fr,1fr,auto] gap-4 border-t p-4"
                    >
                      <div>{user.username || 'Anonymous'}</div>
                      <div className="capitalize">{user.role}</div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserRole(user.id, user.role)}
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedProject.image_url && (
                <div className="relative aspect-video">
                  <img 
                    src={selectedProject.image_url} 
                    alt={selectedProject.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold">Links</h3>
                <div className="space-y-1">
                  {selectedProject.website_url && (
                    <p>
                      <span className="font-medium">Website:</span>{" "}
                      <a 
                        href={selectedProject.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedProject.website_url}
                      </a>
                    </p>
                  )}
                  {selectedProject.github_url && (
                    <p>
                      <span className="font-medium">GitHub:</span>{" "}
                      <a 
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedProject.github_url}
                      </a>
                    </p>
                  )}
                  {selectedProject.twitter_profile && (
                    <p>
                      <span className="font-medium">Twitter:</span>{" "}
                      <a 
                        href={`https://twitter.com/${selectedProject.twitter_profile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        @{selectedProject.twitter_profile}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Stats</h3>
                <p>Views: {selectedProject.views_count}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toggleValidation(selectedProject.id, selectedProject.validated);
                    setSelectedProject(null);
                  }}
                >
                  {selectedProject.validated ? 'Unvalidate' : 'Validate'}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Admin;
