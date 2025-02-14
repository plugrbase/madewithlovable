
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  username: string | null;
  role: 'admin' | 'user';
}

interface UserListProps {
  users: User[];
  onToggleRole: (userId: string, currentRole: 'admin' | 'user') => void;
}

const UserList = ({ users, onToggleRole }: UserListProps) => {
  return (
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
              onClick={() => onToggleRole(user.id, user.role)}
            >
              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
