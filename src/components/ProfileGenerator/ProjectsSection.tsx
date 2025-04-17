import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import SectionCard from "./SectionCard";

interface ProjectsSectionProps {
  onChange: (data: ProjectsSectionData) => void;
  initialData?: ProjectsSectionData;
  onRemove?: () => void;
}

export interface Project {
  name: string;
  description: string;
  url: string;
}

export interface ProjectsSectionData {
  title: string;
  projects: Project[];
}

const ProjectsSection = ({ onChange, initialData, onRemove }: ProjectsSectionProps) => {
  const [data, setData] = useState<ProjectsSectionData>(
    initialData || {
      title: "Projects",
      projects: [
        {
          name: "Project Name",
          description: "Project description goes here",
          url: "https://github.com/yourusername/project",
        },
      ],
    }
  );

  const handleTitleChange = (value: string) => {
    const newData = { ...data, title: value };
    setData(newData);
    onChange(newData);
  };

  const addProject = () => {
    const newData = {
      ...data,
      projects: [
        ...data.projects,
        {
          name: "New Project",
          description: "Project description",
          url: "https://github.com/yourusername/project",
        },
      ],
    };
    setData(newData);
    onChange(newData);
  };

  const removeProject = (index: number) => {
    const newData = {
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    };
    setData(newData);
    onChange(newData);
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...data.projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value,
    };
    
    const newData = { ...data, projects: newProjects };
    setData(newData);
    onChange(newData);
  };

  return (
    <SectionCard 
      title="Projects" 
      description="Showcase your best work and contributions"
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="projects-title">Section Title</Label>
          <Input
            id="projects-title"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Projects"
          />
        </div>

        {data.projects.map((project, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Project {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div>
              <Label htmlFor={`project-name-${index}`}>Name</Label>
              <Input
                id={`project-name-${index}`}
                value={project.name}
                onChange={(e) =>
                  updateProject(index, "name", e.target.value)
                }
                placeholder="Project name"
              />
            </div>
            
            <div>
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                placeholder="Project description"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor={`project-url-${index}`}>URL</Label>
              <Input
                id={`project-url-${index}`}
                value={project.url}
                onChange={(e) =>
                  updateProject(index, "url", e.target.value)
                }
                placeholder="https://github.com/yourusername/project"
              />
            </div>
          </div>
        ))}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={addProject}
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>
    </SectionCard>
  );
};

export default ProjectsSection;