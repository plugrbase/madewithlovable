
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProjectCard from '@/components/ProjectCard';
import FeaturedProject from '@/components/FeaturedProject';
import NewsletterForm from '@/components/NewsletterForm';
import { Search, Filter } from 'lucide-react';

const MOCK_FEATURED_PROJECT = {
  title: "AI-Powered Task Manager",
  description: "A sophisticated task management application built with Lovable, featuring AI-powered task organization and natural language processing.",
  imageUrl: "/placeholder.svg",
  tags: ["AI", "Productivity", "SaaS"],
  link: "#"
};

const MOCK_PROJECTS = [
  {
    title: "E-commerce Template",
    description: "A modern e-commerce template with cart functionality and payment integration.",
    imageUrl: "/placeholder.svg",
    tags: ["E-commerce", "Template"],
    views: 1234
  },
  {
    title: "Blog Platform",
    description: "A full-featured blog platform with markdown support and SEO optimization.",
    imageUrl: "/placeholder.svg",
    tags: ["CMS", "Blog"],
    views: 856
  },
  {
    title: "Authentication Plugin",
    description: "Easy-to-integrate authentication plugin with social login support.",
    imageUrl: "/placeholder.svg",
    tags: ["Plugin", "Auth"],
    views: 2341
  },
  {
    title: "Dashboard UI Kit",
    description: "Modern dashboard components with dark mode and responsive design.",
    imageUrl: "/placeholder.svg",
    tags: ["UI Kit", "Dashboard"],
    views: 1567
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Made with Lovable
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A collection of projects made with Lovable
        </p>
        <div className="max-w-2xl mx-auto flex gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder="Search projects..." />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </section>

      {/* Featured Project */}
      <section className="container mb-20">
        <h2 className="text-2xl font-semibold mb-6">Featured Project</h2>
        <FeaturedProject {...MOCK_FEATURED_PROJECT} />
      </section>

      {/* Projects Grid */}
      <section className="container mb-20">
        <h2 className="text-2xl font-semibold mb-6">Latest Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PROJECTS.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mb-20">
        <div className="max-w-xl mx-auto">
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-gray-600">
                Made with Lovable showcases the best projects built using the Lovable framework.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Submit Project</a></li>
                <li><a href="#" className="hover:text-primary">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
                <li><a href="#" className="hover:text-primary">GitHub</a></li>
                <li><a href="#" className="hover:text-primary">Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
