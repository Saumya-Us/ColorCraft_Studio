import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface UIPreviewProps {
  colors: string[];
}

export function UIPreview({ colors }: UIPreviewProps) {
  const [primary, secondary, accent, background, text] = colors;

  const mockups = [
    {
      name: "Website Card",
      component: (
        <Card className="w-full max-w-sm mx-auto" style={{ backgroundColor: background || '#FFFFFF', borderColor: secondary }}>
          <CardHeader style={{ backgroundColor: primary }}>
            <CardTitle style={{ color: text || '#FFFFFF' }}>Product Card</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <p style={{ color: text || '#000000' }}>This is how your colors look in a real UI component.</p>
              <div className="flex space-x-2">
                <Button size="sm" style={{ backgroundColor: accent, color: text }}>
                  Primary
                </Button>
                <Button size="sm" variant="outline" style={{ borderColor: secondary, color: secondary }}>
                  Secondary
                </Button>
              </div>
              <Badge style={{ backgroundColor: secondary, color: background }}>
                New
              </Badge>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      name: "Form Layout",
      component: (
        <div className="w-full max-w-sm mx-auto p-4 rounded-lg" style={{ backgroundColor: background || '#FFFFFF' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: text || '#000000' }}>Sign Up Form</h3>
          <div className="space-y-3">
            <Input 
              placeholder="Email address" 
              style={{ borderColor: secondary, color: text }}
            />
            <Input 
              placeholder="Password" 
              type="password"
              style={{ borderColor: secondary, color: text }}
            />
            <Button 
              className="w-full"
              style={{ backgroundColor: primary, color: background }}
            >
              Create Account
            </Button>
            <p className="text-sm text-center" style={{ color: secondary }}>
              Already have an account? 
              <span style={{ color: accent }} className="cursor-pointer ml-1">Sign in</span>
            </p>
          </div>
        </div>
      )
    },
    {
      name: "Dashboard",
      component: (
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="p-3 rounded-t-lg" style={{ backgroundColor: primary }}>
            <h3 className="font-semibold" style={{ color: background || '#FFFFFF' }}>Dashboard</h3>
          </div>
          
          {/* Content */}
          <div className="p-4 space-y-3 rounded-b-lg" style={{ backgroundColor: background || '#FFFFFF' }}>
            <div className="flex justify-between items-center">
              <span style={{ color: text }}>Total Sales</span>
              <span className="font-bold" style={{ color: accent }}>$12,543</span>
            </div>
            
            <div className="h-2 rounded-full" style={{ backgroundColor: secondary }}>
              <div 
                className="h-2 rounded-full" 
                style={{ backgroundColor: accent, width: '68%' }}
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: secondary }}>
                <div className="text-sm font-medium" style={{ color: background }}>156</div>
                <div className="text-xs" style={{ color: background }}>Orders</div>
              </div>
              <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: accent }}>
                <div className="text-sm font-medium" style={{ color: background }}>89%</div>
                <div className="text-xs" style={{ color: background }}>Success</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        <Monitor className="inline mr-2 text-indigo-500" size={20} />
        UI Preview
      </h3>
      
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          See how your color palette looks in real UI components
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockups.map((mockup, index) => (
            <motion.div
              key={mockup.name}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-medium text-slate-700 dark:text-slate-300 text-center">
                {mockup.name}
              </h4>
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700">
                {mockup.component}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Color Mapping Legend */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Color Mapping</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            {[
              { name: "Primary", color: primary, usage: "Buttons, headers" },
              { name: "Secondary", color: secondary, usage: "Borders, accents" },
              { name: "Accent", color: accent, usage: "Highlights, links" },
              { name: "Background", color: background, usage: "Backgrounds" },
              { name: "Text", color: text, usage: "Text content" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border border-slate-300"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">{item.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}