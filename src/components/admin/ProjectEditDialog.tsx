
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/admin";
import { useEffect, useState } from "react";

interface ProjectEditDialogProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project, imageFile: File | null) => Promise<void>;
}

const ProjectEditDialog = ({ project, onClose, onSave }: ProjectEditDialogProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(project);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Reset the editing state when a new project is selected
  useEffect(() => {
    setEditingProject(project);
    setImageFile(null);
    setUploadingImage(false);
  }, [project]);

  if (!editingProject) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    await onSave(editingProject, imageFile);
    setUploadingImage(false);
  };

  return (
    <Dialog open={!!editingProject} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Project: {editingProject.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editingProject.title}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {editingProject.image_url && (
              <div className="mt-2">
                <img
                  src={editingProject.image_url}
                  alt="Current project image"
                  className="max-h-32 rounded-md"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={editingProject.website_url || ''}
              onChange={(e) => setEditingProject({ ...editingProject, website_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              type="url"
              value={editingProject.github_url || ''}
              onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter Profile</Label>
            <Input
              id="twitter"
              value={editingProject.twitter_profile || ''}
              onChange={(e) => setEditingProject({ ...editingProject, twitter_profile: e.target.value })}
              placeholder="@username"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploadingImage}>
              {uploadingImage ? "Uploading..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
