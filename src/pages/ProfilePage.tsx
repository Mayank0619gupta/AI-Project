
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, LogOut, User } from 'lucide-react';
import { Background3D } from '@/components/Background3D';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="glass-morphism border-none shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-primary/10 p-1">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl text-gradient">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Registration Number</h3>
                  <p className="text-foreground">{user.regNumber}</p>
                </div>
                
                <Separator className="bg-white/10" />
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/edit-profile')}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive" 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
