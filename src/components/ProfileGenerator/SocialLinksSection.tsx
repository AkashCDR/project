import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Instagram,
  Youtube,
  Twitch,
  Plus,
  Trash2
} from "lucide-react";
import SectionCard from "./SectionCard";

interface SocialLinksSectionProps {
  onChange: (data: SocialLinksSectionData) => void;
  initialData?: SocialLinksSectionData;
  onRemove?: () => void;
}

interface SocialLink {
  type: string;
  username: string;
  url: string;
}

export interface SocialLinksSectionData {
  title: string;
  links: SocialLink[];
}

const SOCIAL_TYPES = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "website", label: "Website", icon: Globe },
  { value: "email", label: "Email", icon: Mail },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "twitch", label: "Twitch", icon: Twitch },
];

const SocialLinksSection = ({ onChange, initialData, onRemove }: SocialLinksSectionProps) => {
  const [data, setData] = useState<SocialLinksSectionData>(
    initialData || {
      title: "Connect with me",
      links: [
        {
          type: "github",
          username: "yourusername",
          url: "https://github.com/yourusername",
        },
      ],
    }
  );

  const handleTitleChange = (value: string) => {
    const newData = { ...data, title: value };
    setData(newData);
    onChange(newData);
  };

  const addLink = () => {
    const newData = {
      ...data,
      links: [
        ...data.links,
        {
          type: "github",
          username: "",
          url: "",
        },
      ],
    };
    setData(newData);
    onChange(newData);
  };

  const removeLink = (index: number) => {
    const newData = {
      ...data,
      links: data.links.filter((_, i) => i !== index),
    };
    setData(newData);
    onChange(newData);
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...data.links];
    
    if (field === "type") {
      const socialType = SOCIAL_TYPES.find(type => type.value === value);
      newLinks[index] = {
        ...newLinks[index],
        type: value,
        // If type changes, update URL prefix
        url: value === "email" 
          ? `mailto:${newLinks[index].username}` 
          : value === "website"
            ? newLinks[index].url || "https://"
            : `https://${value}.com/${newLinks[index].username}`
      };
    } else if (field === "username") {
      const type = newLinks[index].type;
      newLinks[index] = {
        ...newLinks[index],
        username: value,
        // Update URL based on username change
        url: type === "email" 
          ? `mailto:${value}` 
          : type === "website"
            ? newLinks[index].url
            : `https://${type}.com/${value}`
      };
    } else {
      newLinks[index] = {
        ...newLinks[index],
        [field]: value,
      };
    }
    
    const newData = { ...data, links: newLinks };
    setData(newData);
    onChange(newData);
  };

  const getSocialIcon = (type: string) => {
    const socialType = SOCIAL_TYPES.find(t => t.value === type);
    const Icon = socialType?.icon || Globe;
    return <Icon size={16} />;
  };

  return (
    <SectionCard 
      title="Social Links" 
      description="Let people know where to find you online"
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="social-title">Section Title</Label>
          <Input
            id="social-title"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Connect with me"
          />
        </div>

        {data.links.map((link, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getSocialIcon(link.type)}
                <h4 className="text-sm font-medium">
                  {SOCIAL_TYPES.find(t => t.value === link.type)?.label || "Link"}
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLink(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div>
              <Label htmlFor={`social-type-${index}`}>Platform</Label>
              <select
                id={`social-type-${index}`}
                value={link.type}
                onChange={(e) => updateLink(index, "type", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {SOCIAL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={`social-username-${index}`}>
                {link.type === "email" ? "Email Address" : 
                 link.type === "website" ? "Website URL" : "Username"}
              </Label>
              <Input
                id={`social-username-${index}`}
                value={link.username}
                onChange={(e) => updateLink(index, "username", e.target.value)}
                placeholder={
                  link.type === "email" ? "you@example.com" : 
                  link.type === "website" ? "https://your-website.com" : "yourusername"
                }
              />
            </div>

            {link.type !== "email" && link.type !== "website" && (
              <div>
                <Label htmlFor={`social-url-${index}`}>URL (generated)</Label>
                <Input
                  id={`social-url-${index}`}
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  placeholder={`https://${link.type}.com/yourusername`}
                />
              </div>
            )}
          </div>
        ))}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={addLink}
        >
          <Plus size={16} className="mr-2" />
          Add Social Link
        </Button>
      </div>
    </SectionCard>
  );
};

export default SocialLinksSection;