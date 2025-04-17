import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "./SectionCard";

interface AboutSectionProps {
  onChange: (data: AboutSectionData) => void;
  initialData?: AboutSectionData;
  onRemove?: () => void;
}

export interface AboutSectionData {
  title: string;
  subtitle: string;
  description: string;
}

const AboutSection = ({ onChange, initialData, onRemove }: AboutSectionProps) => {
  const [data, setData] = useState<AboutSectionData>(
    initialData || {
      title: "Hi 👋, I'm Your Name",
      subtitle: "A passionate developer from Earth",
      description: "I'm currently working on improving my skills in web development and open source contributions.",
    }
  );

  const handleChange = (field: keyof AboutSectionData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <SectionCard 
      title="About Me" 
      description="Introduce yourself and share what makes you special"
      onRemove={onRemove}
    >
      <div className="space-y-3">
        <div>
          <Label htmlFor="about-title">Title</Label>
          <Input
            id="about-title"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Hi 👋, I'm Your Name"
          />
        </div>
        <div>
          <Label htmlFor="about-subtitle">Subtitle</Label>
          <Input
            id="about-subtitle"
            value={data.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="A passionate developer from Earth"
          />
        </div>
        <div>
          <Label htmlFor="about-description">Description</Label>
          <Textarea
            id="about-description"
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell something about yourself..."
            rows={4}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default AboutSection;
