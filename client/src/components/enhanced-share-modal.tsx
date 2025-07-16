import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateQRCode, generateStyledQRCode } from "@/lib/qr-utils";
import { Copy, QrCode, Download, Share as ShareIcon } from "lucide-react";

interface EnhancedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string[];
}

export function EnhancedShareModal({ isOpen, onClose, currentPalette }: EnhancedShareModalProps) {
  const [shareLink, setShareLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [styledQrCodeUrl, setStyledQrCodeUrl] = useState("");
  const { toast } = useToast();

  const createShareLink = useMutation({
    mutationFn: async (data: { name: string; colors: string[] }) => {
      const response = await apiRequest('POST', '/api/palettes/share', data);
      return response.json();
    },
    onSuccess: async (data) => {
      const link = `${window.location.origin}/palette/${data.shareId}`;
      setShareLink(link);
      
      // Generate QR codes
      try {
        const qrCode = await generateQRCode(link);
        setQrCodeUrl(qrCode);
        
        // Generate styled QR code using first two colors from palette
        const styledQr = await generateStyledQRCode(
          link, 
          currentPalette[0] || '#000000', 
          currentPalette[1] || '#FFFFFF'
        );
        setStyledQrCodeUrl(styledQr);
      } catch (error) {
        console.error('Failed to generate QR codes:', error);
      }
      
      toast({
        title: "Share link created",
        description: "Your palette is now shareable with QR code",
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

  const handleDownloadQR = (qrUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNativeShare = async () => {
    if (navigator.share && shareLink) {
      try {
        await navigator.share({
          title: 'ColorCraft Palette',
          text: 'Check out this amazing color palette!',
          url: shareLink,
        });
      } catch (error) {
        // Fallback to copying link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShareLink("");
      setQrCodeUrl("");
      setStyledQrCodeUrl("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShareIcon className="mr-2 text-blue-500" size={20} />
            Share Palette
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Palette Preview */}
          <div className="grid grid-cols-5 gap-2">
            {currentPalette.map((color, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-lg"
                style={{ backgroundColor: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
          
          {!shareLink ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Button
                onClick={handleCreateLink}
                disabled={createShareLink.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {createShareLink.isPending ? "Creating..." : "Create Share Link"}
              </Button>
            </motion.div>
          ) : (
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="styled-qr">Styled QR</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="space-y-4">
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
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleNativeShare}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="qr" className="space-y-4">
                {qrCodeUrl && (
                  <motion.div 
                    className="text-center space-y-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto rounded-lg shadow-md"
                      width={200}
                      height={200}
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Scan to view the palette
                    </p>
                    <Button
                      onClick={() => handleDownloadQR(qrCodeUrl, 'palette-qr-code.png')}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
              
              <TabsContent value="styled-qr" className="space-y-4">
                {styledQrCodeUrl && (
                  <motion.div 
                    className="text-center space-y-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img 
                      src={styledQrCodeUrl} 
                      alt="Styled QR Code" 
                      className="mx-auto rounded-lg shadow-md"
                      width={200}
                      height={200}
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      QR code styled with your palette colors
                    </p>
                    <Button
                      onClick={() => handleDownloadQR(styledQrCodeUrl, 'palette-styled-qr-code.png')}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Styled QR
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}