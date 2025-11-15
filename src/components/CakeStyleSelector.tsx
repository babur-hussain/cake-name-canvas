import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Cake, Heart, PartyPopper, Sparkles } from "lucide-react";

export type CakeStyle = "birthday" | "wedding" | "celebration" | "custom";

interface CakeStyleSelectorProps {
  value: CakeStyle;
  onChange: (value: CakeStyle) => void;
}

const styles = [
  {
    value: "birthday" as CakeStyle,
    label: "Birthday",
    icon: Cake,
    description: "Colorful & fun",
  },
  {
    value: "wedding" as CakeStyle,
    label: "Wedding",
    icon: Heart,
    description: "Elegant & romantic",
  },
  {
    value: "celebration" as CakeStyle,
    label: "Celebration",
    icon: PartyPopper,
    description: "Festive & joyful",
  },
  {
    value: "custom" as CakeStyle,
    label: "Custom",
    icon: Sparkles,
    description: "Unique design",
  },
];

export const CakeStyleSelector = ({ value, onChange }: CakeStyleSelectorProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <Label className="text-lg font-semibold mb-4 block text-foreground">
        Choose Your Cake Style
      </Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style) => {
            const Icon = style.icon;
            return (
              <label
                key={style.value}
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-card/50 ${
                  value === style.value
                    ? "border-primary bg-card/50 shadow-elegant"
                    : "border-border bg-card/20"
                }`}
              >
                <RadioGroupItem
                  value={style.value}
                  id={style.value}
                  className="sr-only"
                />
                <Icon
                  className={`w-8 h-8 mb-3 transition-colors ${
                    value === style.value ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="font-semibold text-sm mb-1">{style.label}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {style.description}
                </span>
                {value === style.value && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                )}
              </label>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};
