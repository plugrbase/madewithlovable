
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserManagement = (
  users: any[],
  setUsers: (users: any[]) => void,
) => {
  const { toast } = useToast();

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

  const toggleUserDisable = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'enable' : 'disable'} this user?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_disabled: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_disabled: !currentStatus }
          : user
      ));

      toast({
        title: "Success",
        description: `User ${currentStatus ? 'enabled' : 'disabled'} successfully`,
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
    toggleUserRole,
    toggleUserDisable,
  };
};
