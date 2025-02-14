
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  views?: number;
}

const ProjectCard = ({ id, title, description, imageUrl, tags, views }: ProjectCardProps) => {
  return (
    <Link to={`/project/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        {views !== undefined && (
          <CardFooter className="p-4 pt-0 text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            {views} views
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default ProjectCard;
