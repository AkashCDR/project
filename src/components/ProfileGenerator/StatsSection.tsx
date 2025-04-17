import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import SectionCard from "./SectionCard";
import Image from "next/image";

interface StatsSectionProps {
  onChange: (data: StatsSectionData) => void;
  initialData?: StatsSectionData;
  onRemove?: () => void;
}

export interface StatsSectionData {
  title: string;
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  username: string;
  theme: string;
}

const StatsSection = ({
  onChange,
  initialData,
  onRemove,
}: StatsSectionProps) => {
  const [data, setData] = useState<StatsSectionData>(
    initialData || {
      title: "GitHub Stats",
      showStats: true,
      showLanguages: true,
      showStreak: false,
      username: "yourusername",
      theme: "default",
    }
  );

  const handleChange = <K extends keyof StatsSectionData>(
    field: K,
    value: StatsSectionData[K]
  ) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <SectionCard
      title="GitHub Stats"
      description="Showcase your GitHub activity with statistics"
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="stats-title">Section Title</Label>
          <Input
            id="stats-title"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="GitHub Stats"
          />
        </div>

        <div>
          <Label htmlFor="github-username">GitHub Username</Label>
          <Input
            id="github-username"
            value={data.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="yourusername"
          />
        </div>

        <div>
          <Label htmlFor="stats-theme">Theme</Label>
          <select
            id="stats-theme"
            value={data.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="radical">Radical</option>
            <option value="merko">Merko</option>
            <option value="gruvbox">Gruvbox</option>
            <option value="tokyonight">Tokyo Night</option>
            <option value="onedark">One Dark</option>
            <option value="cobalt">Cobalt</option>
            <option value="synthwave">Synthwave</option>
            <option value="highcontrast">High Contrast</option>
            <option value="dracula">Dracula</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-stats" className="cursor-pointer">
            Show GitHub Stats
          </Label>
          <Switch
            id="show-stats"
            checked={data.showStats}
            onCheckedChange={(value) => handleChange("showStats", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-languages" className="cursor-pointer">
            Show Top Languages
          </Label>
          <Switch
            id="show-languages"
            checked={data.showLanguages}
            onCheckedChange={(value) => handleChange("showLanguages", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-streak" className="cursor-pointer">
            Show GitHub Streak
          </Label>
          <Switch
            id="show-streak"
            checked={data.showStreak}
            onCheckedChange={(value) => handleChange("showStreak", value)}
          />
        </div>

        {(data.showStats || data.showLanguages || data.showStreak) && (
          <div className="border rounded-md p-3 bg-muted/20">
            <p className="text-xs text-muted-foreground mb-2">
              Preview (based on username):
            </p>
            <div className="space-y-3">
              {data.showStats && (
                <div className="overflow-hidden rounded">
                  <img
                    src={`https://github-readme-stats.vercel.app/api?username=${data.username}&show_icons=true&theme=${data.theme}`}
                    alt="GitHub Stats"
                    className="w-full h-auto"
                  />
                </div>
              )}
            {data.showLanguages && (
  <div className="overflow-hidden rounded">
    <Image 
      src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=default`}
      width={400}
      height={400}
      alt="Top Languages"
      className="w-full"
    />
  </div>
)}

{data.showStreak && (
  <div className="overflow-hidden rounded">
    <Image
      src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.username}&theme=default`}
      width={400}
      height={400}
      alt="GitHub Streak"
      className="w-full"
    />
  </div>
)}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default StatsSection;
