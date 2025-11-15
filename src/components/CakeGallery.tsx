import { useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CakeItem {
  id: string;
  name: string;
  image: string;
  style: string;
  timestamp: number;
}

interface CakeGalleryProps {
  cakes: CakeItem[];
  onRemove: (id: string) => void;
}

export const CakeGallery = ({ cakes, onRemove }: CakeGalleryProps) => {
  const [selectedCake, setSelectedCake] = useState<CakeItem | null>(null);
  const { toast } = useToast();

  const handleDownload = async (cake: CakeItem) => {
    try {
      const link = document.createElement("a");

      if (cake.image.startsWith("data:")) {
        link.href = cake.image;
      } else {
        const response = await fetch(cake.image);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      }

      link.download = `${cake.name}-cake.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Downloaded! 🎉",
        description: "Your cake image has been saved.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (cake: CakeItem) => {
    const shareText = `Check out my custom ${cake.style} cake with "${cake.name}" on it! 🎂`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Custom Cake",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      toast({
        title: "Copied to clipboard!",
        description: "Share text has been copied. Paste it anywhere!",
      });
    }
  };

  if (cakes.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
        Your Cake Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            className="group relative rounded-xl overflow-hidden border border-border bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-elegant hover-scale"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={cake.image}
                alt={`Cake for ${cake.name}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onClick={() => setSelectedCake(cake)}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{cake.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 capitalize">
                {cake.style} Style
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(cake)}
                  className="flex-1 border-primary/30 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare(cake)}
                  className="flex-1 border-accent/30 hover:bg-accent/10"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemove(cake.id)}
                  className="border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedCake && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedCake(null)}
        >
          <div
            className="max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="outline"
              className="absolute -top-12 right-0 border-primary/50"
              onClick={() => setSelectedCake(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={selectedCake.image}
              alt={`Cake for ${selectedCake.name}`}
              className="w-full h-auto rounded-xl border border-border shadow-elegant"
            />
          </div>
        </div>
      )}
    </div>
  );
};
