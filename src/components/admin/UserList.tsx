
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Ban } from "lucide-react";

interface User {
  id: string;
  username: string | null;
  role: 'admin' | 'user';
  created_at: string;
  is_disabled: boolean;
}

interface UserListProps {
  users: User[];
  onToggleRole: (userId: string, currentRole: 'admin' | 'user') => void;
  onToggleDisable: (userId: string, currentStatus: boolean) => void;
}

const UserList = ({ users, onToggleRole, onToggleDisable }: UserListProps) => {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 p-4 font-medium">
        <div>Username</div>
        <div>Role</div>
        <div>Created</div>
        <div>Actions</div>
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 border-t p-4"
        >
          <div className="flex items-center gap-2">
            {user.username || 'Anonymous'}
            {user.is_disabled && (
              <span className="text-xs text-red-500 font-medium">
                (Disabled)
              </span>
            )}
          </div>
          <div className="capitalize">{user.role}</div>
          <div>{format(new Date(user.created_at), 'MMM d, yyyy')}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleRole(user.id, user.role)}
            >
              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Button>
            <Button
              variant={user.is_disabled ? "destructive" : "outline"}
              size="sm"
              onClick={() => onToggleDisable(user.id, user.is_disabled)}
            >
              <Ban className="h-4 w-4 mr-2" />
              {user.is_disabled ? 'Enable' : 'Disable'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
