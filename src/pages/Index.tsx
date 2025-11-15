import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Cake, Download, Share2, AlertCircle } from "lucide-react";
import { CakeStyleSelector, CakeStyle } from "@/components/CakeStyleSelector";
import { CakeGallery } from "@/components/CakeGallery";
import { AboutSection } from "@/components/AboutSection";
import { WEBHOOK_URL, USE_MOCK_DATA } from "@/config/webhook";
import { generateMockCake } from "@/utils/mockCakeData";

interface CakeItem {
  id: string;
  name: string;
  image: string;
  style: string;
  timestamp: number;
}

const Index = () => {
  const [name, setName] = useState("");
  const [cakeStyle, setCakeStyle] = useState<CakeStyle>("birthday");
  const [isLoading, setIsLoading] = useState(false);
  const [cakeImage, setCakeImage] = useState<string | null>(null);
  const [cakeGallery, setCakeGallery] = useState<CakeItem[]>([]);
  const { toast } = useToast();

  // Load gallery from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cakeGallery");
    if (stored) {
      try {
        setCakeGallery(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load gallery:", error);
      }
    }
  }, []);

  // Save gallery to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cakeGallery", JSON.stringify(cakeGallery));
  }, [cakeGallery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Please enter a name",
        description: "We need a name to create your custom cake!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCakeImage(null);

    try {
      let imageUrl: string | null = null;

      if (USE_MOCK_DATA) {
        // Use mock data for testing
        console.log("Using mock data for testing");
        imageUrl = await generateMockCake(name.trim(), cakeStyle);
      } else {
        // Call the actual webhook
        console.log("Calling webhook:", WEBHOOK_URL);
        console.log("Request payload:", { name: name.trim(), style: cakeStyle });

        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            name: name.trim(),
            style: cakeStyle 
          }),
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          throw new Error(`Webhook returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        
        // Extract image from response (adjust based on your webhook's response format)
        if (data.image) {
          imageUrl = data.image;
        } else if (data.url) {
          imageUrl = data.url;
        } else if (data.imageUrl) {
          imageUrl = data.imageUrl;
        } else if (data.output) {
          imageUrl = data.output;
        } else if (typeof data === 'string') {
          imageUrl = data;
        } else {
          console.error("Unknown response format:", data);
          throw new Error("No image found in response. Check console for response structure.");
        }
      }

      if (!imageUrl) {
        throw new Error("No image URL received");
      }

      setCakeImage(imageUrl);

      // Add to gallery
      const newCake: CakeItem = {
        id: Date.now().toString(),
        name: name.trim(),
        image: imageUrl,
        style: cakeStyle,
        timestamp: Date.now(),
      };
      setCakeGallery((prev) => [newCake, ...prev]);

      toast({
        title: "Your cake is ready! 🎂",
        description: "Enjoy your personalized cake design!",
      });
    } catch (error) {
      console.error("Full error details:", error);
      
      let errorMessage = "We couldn't bake your cake. Please try again.";
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Cannot connect to webhook. Make sure you're using ngrok or a public URL, not localhost.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Oops! Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cakeImage) return;

    try {
      const response = await fetch(cakeImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}-cake.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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

  const handleShare = async () => {
    const shareText = `Check out my custom ${cakeStyle} cake with "${name}" on it! 🎂`;
    
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

  const handleRemoveFromGallery = (id: string) => {
    setCakeGallery((prev) => prev.filter((cake) => cake.id !== id));
    toast({
      title: "Removed from gallery",
      description: "The cake has been removed from your collection.",
    });
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 animate-pulse-glow">
            <Cake className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
            Custom Cake Creator
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your name and watch as we create your personalized cake design
          </p>
          
          {/* Webhook Status Warning */}
          {WEBHOOK_URL.includes("localhost") && (
            <div className="mt-6 max-w-2xl mx-auto p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-semibold text-destructive mb-1">Webhook Configuration Needed</p>
                <p className="text-muted-foreground">
                  Your webhook is set to localhost. Please update <code className="bg-muted px-1 py-0.5 rounded">src/config/webhook.ts</code> with your ngrok URL or enable mock data for testing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cake Style Selector */}
        <CakeStyleSelector value={cakeStyle} onChange={setCakeStyle} />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-12 animate-scale-in">
          <div className="flex flex-col sm:flex-row gap-4 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-elegant">
            <Input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-14 text-lg bg-background/50 border-border focus:border-primary transition-all"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Baking...
                </>
              ) : (
                "Create My Cake"
              )}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cake className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>
            <p className="mt-8 text-xl text-muted-foreground animate-pulse">
              Creating your custom {cakeStyle} cake...
            </p>
          </div>
        )}

        {/* Cake Image Display */}
        {cakeImage && !isLoading && (
          <div className="animate-scale-in mb-12">
            <div className="rounded-2xl overflow-hidden border border-border shadow-elegant bg-card/30 backdrop-blur-sm p-4">
              <img
                src={cakeImage}
                alt="Your custom cake"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Cake
              </Button>
              <Button
                onClick={() => {
                  setName("");
                  setCakeImage(null);
                }}
                variant="outline"
                className="border-accent/50 hover:bg-accent/10"
              >
                Create Another Cake
              </Button>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!cakeImage && !isLoading && cakeGallery.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground text-lg">
              ✨ Choose a style and enter a name to get started
            </p>
          </div>
        )}

        {/* Cake Gallery */}
        <CakeGallery cakes={cakeGallery} onRemove={handleRemoveFromGallery} />

        {/* About Section */}
        <AboutSection />
      </div>
    </div>
  );
};

export default Index;
