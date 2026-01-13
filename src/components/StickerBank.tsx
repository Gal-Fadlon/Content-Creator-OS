import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Flower2, Star, Heart, Sun, Cloud, Moon, Coffee, Leaf, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sticker {
  id: string;
  icon: React.ElementType;
  color: string;
  label: string;
}

const AVAILABLE_STICKERS: Sticker[] = [
  { id: 'flower', icon: Flower2, color: 'text-luxury-purple', label: 'פרח' },
  { id: 'star', icon: Star, color: 'text-sand', label: 'כוכב' },
  { id: 'heart', icon: Heart, color: 'text-burgundy', label: 'לב' },
  { id: 'sun', icon: Sun, color: 'text-sand', label: 'שמש' },
  { id: 'cloud', icon: Cloud, color: 'text-muted-foreground', label: 'ענן' },
  { id: 'moon', icon: Moon, color: 'text-luxury-purple', label: 'ירח' },
  { id: 'coffee', icon: Coffee, color: 'text-earth', label: 'קפה' },
  { id: 'leaf', icon: Leaf, color: 'text-status-published', label: 'עלה' },
  { id: 'music', icon: Music, color: 'text-luxury-purple', label: 'מוזיקה' },
  { id: 'sparkle', icon: Sparkles, color: 'text-sand', label: 'נצנוץ' },
];

interface PlacedSticker extends Sticker {
visibleId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface StickerBankProps {
  onStickerPlace?: (sticker: PlacedSticker) => void;
  placedStickers: PlacedSticker[];
  setPlacedStickers: React.Dispatch<React.SetStateAction<PlacedSticker[]>>;
}

export function StickerBank({ onStickerPlace, placedStickers, setPlacedStickers }: StickerBankProps) {
  const { userRole } = useApp();
  const [draggedSticker, setDraggedSticker] = useState<Sticker | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (userRole !== 'admin') return null;

  const handleDragStart = (sticker: Sticker) => {
    setDraggedSticker(sticker);
  };

  const handleDragEnd = () => {
    setDraggedSticker(null);
  };

  const addSticker = (sticker: Sticker) => {
    const newPlaced: PlacedSticker = {
      ...sticker,
      visibleId: `${sticker.id}-${Date.now()}`,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    };
    setPlacedStickers(prev => [...prev, newPlaced]);
    onStickerPlace?.(newPlaced);
  };

  const removeSticker = (visibleId: string) => {
    setPlacedStickers(prev => prev.filter(s => s.visibleId !== visibleId));
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
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-paper p-3 border border-border animate-fade-in">
          <p className="text-xs text-muted-foreground mb-2 text-center">בנק סטיקרים</p>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_STICKERS.map((sticker) => {
              const Icon = sticker.icon;
              return (
                <button
                  key={sticker.id}
                  draggable
                  onDragStart={() => handleDragStart(sticker)}
                  onDragEnd={handleDragEnd}
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
        </div>
      )}

      {/* Placed stickers overlay info */}
      {placedStickers.length > 0 && (
        <div className="absolute left-0 top-16 text-xs text-muted-foreground">
          {placedStickers.length} סטיקרים
        </div>
      )}
    </div>
  );
}

interface StickerOverlayProps {
  stickers: PlacedSticker[];
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function StickerOverlay({ stickers, onRemove, containerRef }: StickerOverlayProps) {
  const { userRole } = useApp();
  const [dragging, setDragging] = useState<string | null>(null);

  const handleStickerDrag = (e: React.MouseEvent, stickerId: string) => {
    if (userRole !== 'admin') return;
    // Simple drag implementation could be expanded with proper drag-drop
  };

  return (
    <>
      {stickers.map((sticker) => {
        const Icon = sticker.icon;
        return (
          <div
            key={sticker.visibleId}
            className={cn(
              'absolute sticker transition-all',
              sticker.color,
              userRole === 'admin' && 'cursor-move'
            )}
            style={{
              left: sticker.x,
              top: sticker.y,
              transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
            onDoubleClick={() => userRole === 'admin' && onRemove(sticker.visibleId)}
            title={userRole === 'admin' ? 'לחץ פעמיים למחיקה' : sticker.label}
          >
            <Icon className="h-10 w-10" />
          </div>
        );
      })}
    </>
  );
}
