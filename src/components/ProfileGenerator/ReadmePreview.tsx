import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Check } from "lucide-react";
import { AboutSectionData } from "./AboutSection";
import { SkillsSectionData } from "./SkillsSection";
import { ProjectsSectionData, Project } from "./ProjectsSection";
import { SocialLinksSectionData } from "./SocialLinksSection";
import { StatsSectionData } from "./StatsSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import 'github-markdown-css';
interface ReadmePreviewProps {
  sections: {
    about?: AboutSectionData;
    skills?: SkillsSectionData;
    projects?: ProjectsSectionData;
    socialLinks?: SocialLinksSectionData;
    stats?: StatsSectionData;
  };
}

const ReadmePreview = ({ sections }: ReadmePreviewProps) => {
  const [rawMarkdown, setRawMarkdown] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const markdown = generateMarkdown(sections);
    setRawMarkdown(markdown);
  }, [sections]);

  const generateMarkdown = (sections: ReadmePreviewProps["sections"]): string => {
    let markdown = "";
    
    // About Section
    if (sections.about) {
      markdown += `# ${sections.about.title}\n`;
      markdown += `## ${sections.about.subtitle}\n\n`;
      markdown += `${sections.about.description}\n\n`;
    }
    
    // Social Links Section
    if (sections.socialLinks && sections.socialLinks.links.length > 0) {
      markdown += `## ${sections.socialLinks.title}\n\n`;
      
      sections.socialLinks.links.forEach(link => {
        if (link.type === "email") {
          markdown += `- 📫 Email: [${link.username}](mailto:${link.username})\n`;
        } else if (link.type === "website") {
          markdown += `- 🌐 Website: [Visit](${link.url})\n`;
        } else {
          const icons: Record<string, string> = {
            github: "📂",
            twitter: "🐦",
            linkedin: "🔗",
            instagram: "📸",
            youtube: "📺",
            twitch: "🎮"
          };
          
          const icon = icons[link.type] || "🔗";
          markdown += `- ${icon} ${link.type.charAt(0).toUpperCase() + link.type.slice(1)}: [${link.username}](${link.url})\n`;
        }
      });
      
      markdown += "\n";
    }
    
    // Skills Section
    if (sections.skills && sections.skills.skills.length > 0) {
      markdown += `## ${sections.skills.title}\n\n`;
      
      // Add skills as badges
      sections.skills.skills.forEach(skill => {
        markdown += `![${skill}](https://img.shields.io/badge/-${skill.replace(/ /g, "%20")}-05122A?style=flat) `;
      });
      
      markdown += "\n\n";
    }
    
    // Projects Section
    if (sections.projects && sections.projects.projects.length > 0) {
      markdown += `## ${sections.projects.title}\n\n`;
      
      sections.projects.projects.forEach((project: Project) => {
        markdown += `### ${project.name}\n\n`;
        markdown += `${project.description}\n\n`;
        markdown += `[View Project](${project.url})\n\n`;
      });
    }
    
    // GitHub Stats Section
    if (sections.stats && (sections.stats.showStats || sections.stats.showLanguages || sections.stats.showStreak)) {
      markdown += `## ${sections.stats.title}\n\n`;
      
      if (sections.stats.showStats) {
        markdown += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${sections.stats.username}&show_icons=true&theme=${sections.stats.theme})\n\n`;
      }
      
      if (sections.stats.showLanguages) {
        markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${sections.stats.username}&layout=compact&theme=${sections.stats.theme})\n\n`;
      }
      
      if (sections.stats.showStreak) {
        markdown += `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${sections.stats.username}&theme=${sections.stats.theme})\n\n`;
      }
    }
    
    return markdown;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([rawMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "github-profile-readme.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-md shadow-sm bg-card">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="font-medium">Preview & Code</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadMarkdown}
            className="flex items-center gap-1"
          >
            <Download size={14} />
            Download
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="p-4 min-h-[400px] max-h-[600px] overflow-auto">
          <div className="prose dark:prose-invert max-w-none markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {rawMarkdown}
            </ReactMarkdown>
          </div>
        </TabsContent>
        
        <TabsContent value="markdown" className="min-h-[400px] max-h-[600px] overflow-auto">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap bg-muted/10 rounded">
            {rawMarkdown}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadmePreview;