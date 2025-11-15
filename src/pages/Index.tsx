import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Cake } from "lucide-react";

const Index = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cakeImage, setCakeImage] = useState<string | null>(null);
  const { toast } = useToast();

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
      const response = await fetch("http://localhost:5678/webhook/26fc2779-409a-4101-9b53-b429b7e22248", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cake");
      }

      const data = await response.json();
      
      // Assuming the webhook returns an object with an image URL or base64 string
      // Adjust this based on your actual webhook response format
      if (data.image) {
        setCakeImage(data.image);
      } else if (data.url) {
        setCakeImage(data.url);
      } else {
        throw new Error("No image in response");
      }

      toast({
        title: "Your cake is ready! 🎂",
        description: "Enjoy your personalized cake design!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "We couldn't bake your cake. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
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
        </div>

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
              Creating your custom cake...
            </p>
          </div>
        )}

        {/* Cake Image Display */}
        {cakeImage && !isLoading && (
          <div className="animate-scale-in">
            <div className="rounded-2xl overflow-hidden border border-border shadow-elegant bg-card/30 backdrop-blur-sm p-4">
              <img
                src={cakeImage}
                alt="Your custom cake"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="text-center mt-6">
              <Button
                onClick={() => {
                  setName("");
                  setCakeImage(null);
                }}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                Create Another Cake
              </Button>
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!cakeImage && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground text-lg">
              ✨ Enter a name above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
