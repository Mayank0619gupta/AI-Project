
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Background3D } from '@/components/Background3D';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Get instant feedback on your business idea from our advanced AI model."
    },
    {
      title: "Market Validation",
      description: "Understand if your concept meets real market needs and user demands."
    },
    {
      title: "Revenue Models",
      description: "Explore different ways to monetize your idea and create sustainable income."
    },
    {
      title: "Risk Assessment",
      description: "Identify potential challenges and develop mitigation strategies."
    }
  ];

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                  <Badge className="mb-4">Student Entrepreneurs</Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
                    Transform Your Business Ideas with AI
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    Analyze, refine, and elevate your startup concepts with our advanced AI business analyst. Get expert feedback in seconds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      onClick={() => navigate('/chat')}
                      className="text-md"
                    >
                      Start Analyzing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => navigate('/about')}
                      className="text-md"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="relative">
                    <div className="w-full h-[400px] rounded-xl glass-morphism overflow-hidden p-6 flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 text-sm">StartupVision AI</div>
                      </div>
                      <div className="flex-1 overflow-hidden glass-morphism rounded-lg p-4">
                        <div className="mb-4 flex">
                          <div className="bg-primary/20 p-2 rounded-full mr-3">
                            <MessageCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div className="neo-blur rounded-xl p-3 max-w-[80%]">
                            <p className="text-sm text-foreground">Hi there! I'm your AI business analyst. I can help assess your startup idea and provide insights on how to improve it.</p>
                          </div>
                        </div>
                        
                        <div className="mb-4 flex justify-end">
                          <div className="bg-primary rounded-xl p-3 max-w-[80%]">
                            <p className="text-sm">I have an idea for a mobile app that helps students find internship opportunities based on their skills and interests.</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="bg-primary/20 p-2 rounded-full mr-3">
                            <MessageCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div className="neo-blur rounded-xl p-3 max-w-[80%]">
                            <p className="text-sm text-foreground">That's a promising concept! Here's my initial assessment:</p>
                            <ol className="text-sm text-foreground mt-2 list-decimal list-inside">
                              <li>Strong target market: students actively seeking internships</li>
                              <li>Clear value proposition: personalized matching</li>
                              <li>Consider: how will you attract both students and companies?</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 relative">
                        <Input className="pr-10 glass-morphism" placeholder="Enter your business idea..." />
                        <Button size="icon" className="absolute right-1 top-1">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="absolute -z-10 -top-5 -left-5 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                    <div className="absolute -z-10 -bottom-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
                  Turn Your Ideas Into Successful Startups
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our AI-powered business analyst helps student entrepreneurs validate and refine their business concepts.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="glass-morphism p-8 rounded-xl flex flex-col h-full"
                  >
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground flex-grow">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4 mx-auto">
              <div className="glass-morphism rounded-xl p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
                  Ready to Analyze Your Business Idea?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Our AI business analyst is available 24/7 to provide instant feedback and suggestions to improve your startup concept.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/chat');
                    } else {
                      navigate('/signup');
                    }
                  }}
                  className="text-md"
                >
                  {isAuthenticated ? 'Start Chatting Now' : 'Create Free Account'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="text-xl font-bold text-gradient">StartupVision</div>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} StartupVision. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
