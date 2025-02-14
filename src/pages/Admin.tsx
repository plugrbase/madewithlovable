
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Star, StarOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
                      <div>{project.title}</div>
                      <div>{project.profiles?.username || 'Anonymous'}</div>
                      <div className="flex gap-2">
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
    </div>
  );
};

export default Admin;
