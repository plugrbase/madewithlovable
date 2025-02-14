
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, Trash2, Eye, Check, Edit } from "lucide-react";
import { Project } from "@/types/admin";

interface ProjectListProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onToggleValidation: (id: string, currentStatus: boolean) => void;
  onToggleFeatured: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const ProjectList = ({
  projects,
  onView,
  onEdit,
  onToggleValidation,
  onToggleFeatured,
  onDelete,
}: ProjectListProps) => {
  return (
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
              onClick={() => onView(project)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleValidation(project.id, project.validated)}
            >
              <Check className={`h-4 w-4 ${project.validated ? 'text-green-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFeatured(project.id, project.is_featured)}
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
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
