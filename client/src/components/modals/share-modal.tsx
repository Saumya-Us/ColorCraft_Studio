import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Copy } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string[];
}

export function ShareModal({ isOpen, onClose, currentPalette }: ShareModalProps) {
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  const createShareLink = useMutation({
    mutationFn: async (data: { name: string; colors: string[] }) => {
      const response = await apiRequest('POST', '/api/palettes/share', data);
      return response.json();
    },
    onSuccess: (data) => {
      const link = `${window.location.origin}/palette/${data.shareId}`;
      setShareLink(link);
      toast({
        title: "Share link created",
        description: "Your palette is now shareable",
      });
    },
    onError: () => {
      toast({
        title: "Error creating share link",
        description: "Failed to create shareable link",
        variant: "destructive",
      });
    },
  });

  const handleCreateLink = () => {
    createShareLink.mutate({
      name: "Shared Palette",
      colors: currentPalette,
    });
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Palette</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {shareLink ? (
            <div>
              <Label htmlFor="share-link">Shareable Link</Label>
              <div className="flex mt-1 space-x-2">
                <Input
                  id="share-link"
                  value={shareLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  size="icon"
                  onClick={handleCopyLink}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleCreateLink}
              disabled={createShareLink.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {createShareLink.isPending ? "Creating..." : "Create Share Link"}
            </Button>
          )}
          
          <div className="grid grid-cols-5 gap-2">
            {currentPalette.map((color, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
