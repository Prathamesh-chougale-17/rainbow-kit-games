import type { LucideIcon } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  gradientColor: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
  gradientColor,
}: FeatureCardProps) {
  return (
    <MagicCard
      className="p-0"
      gradientColor={gradientColor}
      gradientOpacity={0.1}
    >
      <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader>
          <Icon className={`size-8 ${iconColor} mb-2`} />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </MagicCard>
  );
}
