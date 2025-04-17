import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onRemove?: () => void;
  isDraggable?: boolean;
}

const SectionCard = ({
  title,
  description,
  children,
  onRemove,
  isDraggable = true,
}: SectionCardProps) => {
  return (
    <Card className="mb-4 border border-border">
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {isDraggable && (
              <GripVertical
                size={16}
                className="cursor-move text-muted-foreground"
              />
            )}
            <CardTitle className="text-md">{title}</CardTitle>
          </div>
          {description && (
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 rounded-full"
          >
            <X size={14} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-3">{children}</CardContent>
    </Card>
  );
};

export default SectionCard;