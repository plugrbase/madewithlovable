
export interface Project {
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
