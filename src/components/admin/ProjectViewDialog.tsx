
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/admin";

interface ProjectViewDialogProps {
  project: Project | null;
  onClose: () => void;
  onValidate: (id: string, currentStatus: boolean) => void;
}

const ProjectViewDialog = ({ project, onClose, onValidate }: ProjectViewDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {project.image_url && (
            <div className="relative aspect-video">
              <img 
                src={project.image_url} 
                alt={project.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
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
              {project.website_url && (
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  <a 
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {project.website_url}
                  </a>
                </p>
              )}
              {project.github_url && (
                <p>
                  <span className="font-medium">GitHub:</span>{" "}
                  <a 
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {project.github_url}
                  </a>
                </p>
              )}
              {project.twitter_profile && (
                <p>
                  <span className="font-medium">Twitter:</span>{" "}
                  <a 
                    href={`https://twitter.com/${project.twitter_profile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    @{project.twitter_profile}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Stats</h3>
            <p>Views: {project.views_count}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onValidate(project.id, project.validated);
                onClose();
              }}
            >
              {project.validated ? 'Unvalidate' : 'Validate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewDialog;
