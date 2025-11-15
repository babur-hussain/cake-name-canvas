import { Sparkles, Wand2, Image, Heart } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Design",
      description: "Advanced artificial intelligence creates unique cake designs tailored to your name and style preferences.",
    },
    {
      icon: Image,
      title: "Instant Generation",
      description: "Watch your personalized cake come to life in seconds with our high-speed image generation technology.",
    },
    {
      icon: Sparkles,
      title: "Multiple Styles",
      description: "Choose from birthday, wedding, celebration, or custom styles to match any occasion perfectly.",
    },
    {
      icon: Heart,
      title: "Share & Download",
      description: "Keep your creations forever! Download high-quality images or share them with friends and family.",
    },
  ];

  return (
    <section className="mt-24 py-16 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-gradient">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our Custom Cake Creator uses cutting-edge AI technology to transform your name 
            into beautiful, personalized cake designs. Perfect for celebrations, gifts, or just for fun!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary/30 transition-all hover-scale"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <h3 className="text-2xl font-bold mb-3">Ready to Create?</h3>
          <p className="text-muted-foreground">
            Start designing your personalized cake masterpiece today. It's free, 
            fun, and takes just seconds!
          </p>
        </div>
      </div>
    </section>
  );
};
