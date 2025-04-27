
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, User, LogIn, History, Info, Contact } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gradient">
            StartupVision
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-1">
              <Info size={18} />
              <span>About</span>
            </div>
          </Link>
          <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-1">
              <Contact size={18} />
              <span>Contact</span>
            </div>
          </Link>
          <Link to="/chat" className="text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-1">
              <MessageCircle size={18} />
              <span>Chatbot</span>
            </div>
          </Link>
          <Link to="/history" className="text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-1">
              <History size={18} />
              <span>History</span>
            </div>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-morphism">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/edit-profile')}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button variant="default" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" className="px-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={menuOpen 
                  ? "M6 18L18 6M6 6l12 12" 
                  : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
              />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden neo-blur absolute top-full left-0 right-0 py-4 px-6 space-y-4">
          <Link to="/about" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-2">
              <Info size={18} />
              <span>About</span>
            </div>
          </Link>
          <Link to="/contact" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-2">
              <Contact size={18} />
              <span>Contact</span>
            </div>
          </Link>
          <Link to="/chat" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span>Chatbot</span>
            </div>
          </Link>
          <Link to="/history" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
            <div className="flex items-center gap-2">
              <History size={18} />
              <span>History</span>
            </div>
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="py-2 border-t border-white/10"></div>
              <Link to="/profile" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
                Profile
              </Link>
              <Link to="/edit-profile" className="block py-2 text-foreground/80 hover:text-foreground transition-colors">
                Edit Profile
              </Link>
              <button 
                onClick={logout} 
                className="block w-full text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="py-2 border-t border-white/10"></div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button variant="default" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
