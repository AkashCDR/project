import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import SectionCard from "./SectionCard";

interface SkillsSectionProps {
  onChange: (data: SkillsSectionData) => void;
  initialData?: SkillsSectionData;
  onRemove?: () => void;
}

export interface SkillsSectionData {
  title: string;
  skills: string[];
}

const SkillsSection = ({ onChange, initialData, onRemove }: SkillsSectionProps) => {
  const [data, setData] = useState<SkillsSectionData>(
    initialData || {
      title: "Skills",
      skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS", "Git"],
    }
  );

  const [newSkill, setNewSkill] = useState("");

  const handleTitleChange = (value: string) => {
    const newData = { ...data, title: value };
    setData(newData);
    onChange(newData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      const newData = {
        ...data,
        skills: [...data.skills, newSkill.trim()],
      };
      setData(newData);
      onChange(newData);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const newData = {
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    };
    setData(newData);
    onChange(newData);
  };

  return (
    <SectionCard 
      title="Skills" 
      description="Showcase your technical skills and expertise"
      onRemove={onRemove}
    >
      <div className="space-y-3">
        <div>
          <Label htmlFor="skills-title">Section Title</Label>
          <Input
            id="skills-title"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Skills"
          />
        </div>
        
        <div>
          <Label htmlFor="skills-list">Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 focus:outline-none"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              id="new-skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button size="sm" onClick={addSkill} type="button">
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default SkillsSection;