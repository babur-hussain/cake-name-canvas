// Mock data for testing without webhook
export const generateMockCake = async (name: string, style: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a placeholder image URL (you can replace with actual test images)
  const mockImages = [
    "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80",
  ];
  
  const randomIndex = Math.floor(Math.random() * mockImages.length);
  return mockImages[randomIndex];
};
