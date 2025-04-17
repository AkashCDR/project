"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AboutSection, { AboutSectionData } from "./AboutSection";
import SkillsSection, { SkillsSectionData } from "./SkillsSection";
import ProjectsSection, { ProjectsSectionData } from "./ProjectsSection";
import SocialLinksSection, { SocialLinksSectionData } from "./SocialLinksSection";
import StatsSection, { StatsSectionData } from "./StatsSection";
import ReadmePreview from "./ReadmePreview";

type SectionType = "about" | "skills" | "projects" | "socialLinks" | "stats";

interface SectionConfig {
  type: SectionType;
  label: string;
}

const availableSections: SectionConfig[] = [
  { type: "about", label: "About Me" },
  { type: "skills", label: "Skills" },
  { type: "projects", label: "Projects" },
  { type: "socialLinks", label: "Social Links" },
  { type: "stats", label: "GitHub Stats" },
];

const ProfileGenerator = () => {
  const [activeSections, setActiveSections] = useState<SectionType[]>(["about"]);
  const [sectionData, setSectionData] = useState<{
    about?: AboutSectionData;
    skills?: SkillsSectionData;
    projects?: ProjectsSectionData;
    socialLinks?: SocialLinksSectionData;
    stats?: StatsSectionData;
  }>({
    about: {
      title: "Hi 👋, I'm Your Name",
      subtitle: "A passionate developer from Earth",
      description: "I'm currently working on improving my skills in web development and open source contributions.",
    },
  });

  const addSection = (type: SectionType) => {
    if (!activeSections.includes(type)) {
      setActiveSections([...activeSections, type]);
    }
  };

  const removeSection = (type: SectionType) => {
    setActiveSections(activeSections.filter((section) => section !== type));
    
    // Remove the section data
    const newSectionData = { ...sectionData };
    delete newSectionData[type];
    setSectionData(newSectionData);
  };

  const updateSectionData = <T extends SectionType>(type: T, data: any) => {
    setSectionData({
      ...sectionData,
      [type]: data,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <div className=" p-4 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">GitHub Profile Generator</h2>
            <p className=" mb-4">
              Design your perfect GitHub profile README with this drag-and-drop generator.
              Add sections, customize content, and get beautiful results.
            </p>
            
            {/* Section Manager */}
            <div className="my-4">
              <h3 className="text-md font-semibold mb-2">Add Sections</h3>
              <div className="flex flex-wrap gap-2">
                {availableSections.map((section) => (
                  <Button
                    key={section.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addSection(section.type)}
                    disabled={activeSections.includes(section.type)}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} />
                    {section.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Section Editors */}
          <div className="space-y-4">
            {activeSections.includes("about") && (
              <AboutSection
                onChange={(data) => updateSectionData("about", data)}
                initialData={sectionData.about}
                onRemove={() => removeSection("about")}
              />
            )}
            
            {activeSections.includes("skills") && (
              <SkillsSection
                onChange={(data) => updateSectionData("skills", data)}
                initialData={sectionData.skills}
                onRemove={() => removeSection("skills")}
              />
            )}
            
            {activeSections.includes("projects") && (
              <ProjectsSection
                onChange={(data) => updateSectionData("projects", data)}
                initialData={sectionData.projects}
                onRemove={() => removeSection("projects")}
              />
            )}
            
            {activeSections.includes("socialLinks") && (
              <SocialLinksSection
                onChange={(data) => updateSectionData("socialLinks", data)}
                initialData={sectionData.socialLinks}
                onRemove={() => removeSection("socialLinks")}
              />
            )}
            
            {activeSections.includes("stats") && (
              <StatsSection
                onChange={(data) => updateSectionData("stats", data)}
                initialData={sectionData.stats}
                onRemove={() => removeSection("stats")}
              />
            )}
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="sticky top-8">
            <ReadmePreview sections={sectionData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGenerator;