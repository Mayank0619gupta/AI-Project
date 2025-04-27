
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Background3D } from '@/components/Background3D';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutPage: React.FC = () => {
  const features = [
    {
      title: "Business Idea Assessment",
      description: "Get professional feedback on your startup concept and identify strengths and weaknesses.",
      icon: "📊"
    },
    {
      title: "Market Analysis",
      description: "Understand your target market better with data-driven insights and competitive landscape analysis.",
      icon: "🔍"
    },
    {
      title: "Revenue Model Optimization",
      description: "Explore different monetization strategies to maximize your startup's earning potential.",
      icon: "💰"
    },
    {
      title: "Risk Evaluation",
      description: "Identify potential risks and develop mitigation strategies to protect your business.",
      icon: "⚠️"
    },
    {
      title: "Funding Guidance",
      description: "Get advice on securing investments and creating compelling pitches for potential investors.",
      icon: "💼"
    },
    {
      title: "Growth Strategy",
      description: "Develop actionable plans to scale your business effectively and sustainably.",
      icon: "📈"
    }
  ];

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4">About Us</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Elevating Student Startups with AI-Powered Insights
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                StartupVision helps student entrepreneurs refine their business ideas, identify opportunities, and navigate the challenges of launching a successful venture.
              </p>
            </div>
            
            <div className="glass-morphism rounded-xl p-8 mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gradient">Our Mission</h2>
              <p className="text-lg mb-4">
                StartupVision is dedicated to democratizing access to expert business analysis for student entrepreneurs. We believe that great ideas can come from anywhere, and we're committed to helping students transform their innovative concepts into viable businesses.
              </p>
              <p className="text-lg">
                By leveraging advanced AI technology, we provide personalized feedback, market insights, and strategic guidance that would typically only be available through expensive consultants or business accelerators.
              </p>
            </div>
            
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-center text-gradient">What StartupVision Can Do For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="glass-morphism border-none overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="glass-morphism rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gradient">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Share Your Idea</h3>
                  <p className="text-muted-foreground">Tell our AI about your business concept, target market, and objectives.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Get Expert Analysis</h3>
                  <p className="text-muted-foreground">Receive comprehensive feedback identifying strengths, weaknesses, and opportunities.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Refine & Implement</h3>
                  <p className="text-muted-foreground">Use the actionable insights to improve your business model and execution strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
