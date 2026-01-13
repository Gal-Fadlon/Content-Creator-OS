import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageIcon, Upload, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default backdrop options
const DEFAULT_BACKDROPS = [
  { id: 'minimal', name: 'מינימלי', url: '', color: 'bg-background' },
  { id: 'cream', name: 'שמנת', url: '', color: 'bg-cream' },
  { id: 'warm', name: 'חם', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', color: '' },
  { id: 'botanical', name: 'בוטני', url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80', color: '' },
  { id: 'marble', name: 'שיש', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&q=80', color: '' },
  { id: 'linen', name: 'פשתן', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1920&q=80', color: '' },
];

interface BackdropManagerProps {
  currentBackdrop: string;
  onBackdropChange: (backdrop: string) => void;
}

export function BackdropManager({ currentBackdrop, onBackdropChange }: BackdropManagerProps) {
  const { userRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (userRole !== 'admin') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onBackdropChange(url);
      setIsOpen(false);
    }
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      onBackdropChange(customUrl.trim());
      setCustomUrl('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-card/80 backdrop-blur border-sand/50 hover:border-sand"
        >
          <ImageIcon className="h-4 w-4" />
          רקע חודשי
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">בחירת רקע חודשי</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preset options */}
          <div className="grid grid-cols-3 gap-3">
            {DEFAULT_BACKDROPS.map((backdrop) => (
              <button
                key={backdrop.id}
                onClick={() => {
                  onBackdropChange(backdrop.url);
                  setIsOpen(false);
                }}
                className={cn(
                  'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                  currentBackdrop === backdrop.url 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-sand'
                )}
              >
                {backdrop.url ? (
                  <img 
                    src={backdrop.url} 
                    alt={backdrop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={cn('w-full h-full', backdrop.color)} />
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 text-center">
                  {backdrop.name}
                </span>
                {currentBackdrop === backdrop.url && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom upload */}
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-sm font-medium">העלאת תמונה מותאמת אישית</p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 gap-2"
              >
                <Upload className="h-4 w-4" />
                בחר קובץ
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="או הדבק כתובת תמונה..."
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                dir="ltr"
              />
              <Button onClick={handleCustomUrl} disabled={!customUrl.trim()}>
                החל
              </Button>
            </div>
          </div>

          {/* Clear option */}
          {currentBackdrop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onBackdropChange('');
                setIsOpen(false);
              }}
              className="w-full text-muted-foreground"
            >
              <X className="h-4 w-4 ml-2" />
              הסר רקע
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
