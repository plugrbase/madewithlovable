
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SubmitProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a project",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            website_url: websiteUrl,
            github_url: githubUrl,
            twitter_profile: twitterProfile,
            image_url: imageUrl,
            user_id: user.id,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
        body: { email: user.email, projectTitle: title },
      });

      if (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      toast({
        title: "Success!",
        description: "Your project has been submitted and is pending review. We'll notify you once it's approved.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Submit Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter Profile</Label>
          <Input
            id="twitter"
            value={twitterProfile}
            onChange={(e) => setTwitterProfile(e.target.value)}
            placeholder="@username"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Project"}
        </Button>
      </form>
    </div>
  );
};

export default SubmitProject;
