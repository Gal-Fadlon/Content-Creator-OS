import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Flower2, Star, Heart, Sun, Cloud, Moon, Coffee, Leaf, Music, Upload, Crop, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlacedSticker } from '@/types/content';

interface BaseStickerDef {
  id: string;
  icon: React.ElementType;
  color: string;
  label: string;
}

const AVAILABLE_STICKERS: BaseStickerDef[] = [
  { id: 'flower', icon: Flower2, color: 'text-royal-blue', label: 'פרח' },
  { id: 'star', icon: Star, color: 'text-sand', label: 'כוכב' },
  { id: 'heart', icon: Heart, color: 'text-burgundy', label: 'לב' },
  { id: 'sun', icon: Sun, color: 'text-sand', label: 'שמש' },
  { id: 'cloud', icon: Cloud, color: 'text-muted-foreground', label: 'ענן' },
  { id: 'moon', icon: Moon, color: 'text-royal-blue', label: 'ירח' },
  { id: 'coffee', icon: Coffee, color: 'text-earth', label: 'קפה' },
  { id: 'leaf', icon: Leaf, color: 'text-status-published', label: 'עלה' },
  { id: 'music', icon: Music, color: 'text-royal-blue', label: 'מוזיקה' },
  { id: 'sparkle', icon: Sparkles, color: 'text-sand', label: 'נצנוץ' },
];

// Map icon names to components for rendering
const ICON_MAP: Record<string, React.ElementType> = {
  flower: Flower2,
  star: Star,
  heart: Heart,
  sun: Sun,
  cloud: Cloud,
  moon: Moon,
  coffee: Coffee,
  leaf: Leaf,
  music: Music,
  sparkle: Sparkles,
};

interface StickerBankProps {
  onStickerPlace?: (sticker: PlacedSticker) => void;
}

export function StickerBank({ onStickerPlace }: StickerBankProps) {
  const { userRole, getCurrentMonthState, setMonthlyStickers, addCustomSticker, removeCustomSticker } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [stickerLabel, setStickerLabel] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const monthState = getCurrentMonthState();
  const placedStickers = monthState.stickers;
  const customStickerBank = monthState.customStickerBank;

  if (userRole !== 'admin') return null;

  const addSticker = (sticker: BaseStickerDef) => {
    const newPlaced: PlacedSticker = {
      id: sticker.id,
      iconType: 'lucide',
      lucideIcon: sticker.id,
      color: sticker.color,
      label: sticker.label,
      visibleId: `${sticker.id}-${Date.now()}`,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    };
    setMonthlyStickers([...placedStickers, newPlaced]);
    onStickerPlace?.(newPlaced);
  };
  
  const addCustomStickerToCalendar = (customSticker: { id: string; imageUrl: string; label: string }) => {
    const newPlaced: PlacedSticker = {
      id: customSticker.id,
      icon: customSticker.imageUrl,
      iconType: 'custom',
      color: '',
      label: customSticker.label,
      visibleId: `custom-${Date.now()}`,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    };
    setMonthlyStickers([...placedStickers, newPlaced]);
    onStickerPlace?.(newPlaced);
  };

  const removeSticker = (visibleId: string) => {
    setMonthlyStickers(placedStickers.filter(s => s.visibleId !== visibleId));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };
  
  const handleSaveCustomSticker = () => {
    if (uploadPreview && stickerLabel.trim()) {
      addCustomSticker({
        imageUrl: uploadPreview,
        label: stickerLabel.trim(),
      });
      setUploadPreview(null);
      setStickerLabel('');
      setShowUploadDialog(false);
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'rounded-full w-12 h-12 shadow-soft bg-card border-sand',
          isExpanded && 'bg-sand text-primary-foreground'
        )}
      >
        <Sparkles className="h-5 w-5" />
      </Button>

      {/* Sticker Drawer */}
      {isExpanded && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-paper p-4 border border-border animate-fade-in max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3 text-center font-medium">בנק סטיקרים</p>
          
          {/* Default stickers */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {AVAILABLE_STICKERS.map((sticker) => {
              const Icon = sticker.icon;
              return (
                <button
                  key={sticker.id}
                  onClick={() => addSticker(sticker)}
                  className={cn(
                    'sticker p-2 rounded-lg hover:bg-muted/50 transition-colors',
                    sticker.color
                  )}
                  title={sticker.label}
                >
                  <Icon className="h-6 w-6" />
                </button>
              );
            })}
          </div>
          
          {/* Custom stickers section */}
          {customStickerBank.length > 0 && (
            <>
              <div className="border-t border-border/50 pt-3 mb-2">
                <p className="text-xs text-muted-foreground mb-2">סטיקרים מותאמים</p>
                <div className="grid grid-cols-2 gap-2">
                  {customStickerBank.map((sticker) => (
                    <div key={sticker.id} className="relative group">
                      <button
                        onClick={() => addCustomStickerToCalendar(sticker)}
                        className="sticker p-1 rounded-lg hover:bg-muted/50 transition-colors w-full"
                        title={sticker.label}
                      >
                        <img 
                          src={sticker.imageUrl} 
                          alt={sticker.label} 
                          className="h-8 w-8 object-contain mx-auto"
                        />
                      </button>
                      <button
                        onClick={() => removeCustomSticker(sticker.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Upload custom sticker button */}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 gap-2 text-xs"
              >
                <Upload className="h-3 w-3" />
                העלה סטיקר מותאם
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">יצירת סטיקר מותאם אישית</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {!uploadPreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-sand transition-colors"
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">לחץ להעלאת תמונה</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={uploadPreview} 
                      alt="Preview" 
                      className="w-full h-48 object-contain rounded-xl border border-border bg-muted/20"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setUploadPreview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {uploadPreview && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">שם הסטיקר</label>
                      <input
                        type="text"
                        value={stickerLabel}
                        onChange={(e) => setStickerLabel(e.target.value)}
                        placeholder="למשל: לוגו, פרח מיוחד..."
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2"
                        onClick={handleSaveCustomSticker}
                        disabled={!stickerLabel.trim()}
                      >
                        <Crop className="h-4 w-4" />
                        שמור סטיקר
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Placed stickers count */}
      {placedStickers.length > 0 && (
        <div className="absolute left-0 top-16 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded-full border border-border/50">
          {placedStickers.length} סטיקרים
        </div>
      )}
    </div>
  );
}

interface StickerOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function StickerOverlay({ containerRef }: StickerOverlayProps) {
  const { userRole, getCurrentMonthState, setMonthlyStickers } = useApp();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const monthState = getCurrentMonthState();
  const stickers = monthState.stickers;
  
  const removeSticker = (visibleId: string) => {
    setMonthlyStickers(stickers.filter(s => s.visibleId !== visibleId));
  };

  const handleMouseDown = (e: React.MouseEvent, sticker: PlacedSticker) => {
    if (userRole !== 'admin') return;
    e.preventDefault();
    setDragging(sticker.visibleId);
    setDragOffset({
      x: e.clientX - sticker.x,
      y: e.clientY - sticker.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    const newStickers = stickers.map(s => 
      s.visibleId === dragging 
        ? { ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
        : s
    );
    setMonthlyStickers(newStickers);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-30"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {stickers.map((sticker) => {
        const isCustom = sticker.iconType === 'custom';
        const IconComponent = !isCustom && sticker.lucideIcon ? ICON_MAP[sticker.lucideIcon] : null;
        
        return (
          <div
            key={sticker.visibleId}
            className={cn(
              'absolute sticker transition-transform pointer-events-auto',
              sticker.color,
              userRole === 'admin' && 'cursor-move',
              dragging === sticker.visibleId && 'scale-110 z-50'
            )}
            style={{
              left: sticker.x,
              top: sticker.y,
              transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
            onMouseDown={(e) => handleMouseDown(e, sticker)}
            onDoubleClick={() => userRole === 'admin' && removeSticker(sticker.visibleId)}
            title={userRole === 'admin' ? 'גרור למיקום חדש, לחץ פעמיים למחיקה' : sticker.label}
          >
            {isCustom && sticker.icon ? (
              <img src={sticker.icon} alt={sticker.label} className="h-10 w-10 object-contain" />
            ) : IconComponent ? (
              <IconComponent className="h-10 w-10" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}