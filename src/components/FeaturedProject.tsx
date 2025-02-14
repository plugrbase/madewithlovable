
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface FeaturedProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link: string;
}

const FeaturedProject = ({ title, description, imageUrl, tags, link }: FeaturedProjectProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <div className="flex gap-2 flex-wrap mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
          <Button asChild className="group">
            <a href={link}>
              View Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
};

export default FeaturedProject;
