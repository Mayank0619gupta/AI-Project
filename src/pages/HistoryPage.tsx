
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Navbar } from '@/components/Navbar';
import { Background3D } from '@/components/Background3D';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { sessions, loadSession, deleteSession } = useChat();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gradient">Chat History</h1>
              <p className="text-muted-foreground">
                Review your previous conversations with the StartupVision AI
              </p>
            </div>
            
            {sessions.length === 0 ? (
              <div className="glass-morphism rounded-lg p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">No chat history yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start a new conversation with our AI to get feedback on your business idea
                </p>
                <Button onClick={() => navigate('/chat')}>
                  Start a New Chat
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="glass-morphism overflow-hidden border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{session.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(session.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">
                        {session.messages.length > 0 
                          ? session.messages[0].content 
                          : "Empty conversation"}
                      </p>
                      <p className="text-xs mt-1">
                        {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          loadSession(session.id);
                          navigate('/chat');
                        }}
                      >
                        Continue
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neo-blur border-none">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this conversation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteSession(session.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
