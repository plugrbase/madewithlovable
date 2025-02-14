
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Project } from "@/types/admin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface ProjectEditDialogProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project, imageFile: File | null) => Promise<void>;
}

const ProjectEditDialog = ({ project, onClose, onSave }: ProjectEditDialogProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(project);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setEditingProject(project);
    setImageFile(null);
    setUploadingImage(false);
    if (project) {
      fetchCategories();
      fetchProjectCategories(project.id);
    }
  }, [project]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProjectCategories = async (projectId: string) => {
    const { data } = await supabase
      .from('project_categories')
      .select('category_id')
      .eq('project_id', projectId);
    
    if (data) {
      setSelectedCategories(data.map(pc => pc.category_id));
    }
  };

  if (!editingProject) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);

    try {
      // First save the project
      await onSave(editingProject, imageFile);

      // Then update the project categories
      if (project) {
        // Delete existing categories
        await supabase
          .from('project_categories')
          .delete()
          .eq('project_id', project.id);

        // Insert new categories
        if (selectedCategories.length > 0) {
          await supabase
            .from('project_categories')
            .insert(
              selectedCategories.map(categoryId => ({
                project_id: project.id,
                category_id: categoryId,
              }))
            );
        }
      }
    } finally {
      setUploadingImage(false);
    }
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
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.id]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
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
