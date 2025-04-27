
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import aiService from '@/services/aiService';

interface ApiKeySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load API key if exists
    const savedApiKey = aiService.getApiKey() || '';
    setApiKey(savedApiKey);
  }, [open]);

  const handleSave = () => {
    setIsLoading(true);
    try {
      if (apiKey.trim()) {
        aiService.setApiKey(apiKey.trim());
        toast({
          title: "API key saved",
          description: "Your API key has been saved successfully.",
        });
      } else {
        aiService.clearApiKey();
        toast({
          title: "API key removed",
          description: "Your API key has been removed.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable real-time responses.
            Your key is stored locally on your device and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              type="password"
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              You can get an API key from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI's website
              </a>.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
