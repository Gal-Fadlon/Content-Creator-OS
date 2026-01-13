import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { GripVertical, ImageIcon, ZoomIn, ZoomOut, Move, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GridItem {
  id: string;
  mediaUrl?: string;
  coverImageUrl?: string;
  type: 'post' | 'story' | 'reel';
  gridOrder?: number;
  gridZoom?: number;
  gridOffsetX?: number;
  gridOffsetY?: number;
}

export function InteractiveGridView() {
  const { contentItems, selectedClientId, userRole, updateContentItem } = useApp();
  const { toast } = useToast();
  const isAdmin = userRole === 'admin';
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  
  // Get approved content for this client, sorted by gridOrder or date
  const clientContent = contentItems
    .filter(item => item.clientId === selectedClientId && item.status === 'approved')
    .sort((a, b) => {
      if (a.gridOrder !== undefined && b.gridOrder !== undefined) {
        return a.gridOrder - b.gridOrder;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (!isAdmin || editingItem) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (!isAdmin || itemId === draggedItem) return;
    setDragOverItem(itemId);
  };
  
  const handleDragLeave = () => {
    setDragOverItem(null);
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!isAdmin || !draggedItem || draggedItem === targetId) return;
    
    const draggedIndex = clientContent.findIndex(item => item.id === draggedItem);
    const targetIndex = clientContent.findIndex(item => item.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newOrder = [...clientContent];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    newOrder.forEach((item, index) => {
      updateContentItem(item.id, { gridOrder: index });
    });
    
    toast({
      title: 'סדר עודכן',
      description: 'סדר הפריטים בגריד שונה',
    });
    
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  const handleCoverUploadClick = (itemId: string) => {
    if (!isAdmin) return;
    setUploadingFor(itemId);
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;
    
    const url = URL.createObjectURL(file);
    updateContentItem(uploadingFor, { coverImageUrl: url });
    
    toast({
      title: 'תמונת קאבר עודכנה',
      description: 'התמונה תופיע בתצוגת הגריד',
    });
    
    setUploadingFor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleZoomChange = (itemId: string, zoom: number) => {
    updateContentItem(itemId, { gridZoom: zoom });
  };
  
  const handleOffsetChange = (itemId: string, offsetX: number, offsetY: number) => {
    updateContentItem(itemId, { gridOffsetX: offsetX, gridOffsetY: offsetY });
  };
  
  const getItem = (id: string) => clientContent.find(item => item.id === id);
  
  return (
    <div className="space-y-4">
      {isAdmin && (
        <p className="text-sm text-muted-foreground text-center font-body">
          גרור פריטים כדי לשנות את הסדר • לחץ על ⚙️ לעריכת מיקום וזום בתוך המסגרת
        </p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* 3-Column Grid with 4:5 aspect ratio */}
      <div className="grid grid-cols-3 gap-1 max-w-2xl mx-auto">
        {clientContent.map((item) => {
          const zoom = item.gridZoom ?? 1;
          const offsetX = item.gridOffsetX ?? 0;
          const offsetY = item.gridOffsetY ?? 0;
          const isEditing = editingItem === item.id;
          
          return (
            <div
              key={item.id}
              draggable={isAdmin && !isEditing}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                'aspect-[4/5] bg-muted rounded-sm overflow-hidden relative group transition-all',
                isAdmin && !isEditing && 'cursor-grab active:cursor-grabbing',
                draggedItem === item.id && 'opacity-50 scale-95',
                dragOverItem === item.id && 'ring-2 ring-sand ring-offset-2'
              )}
            >
              {/* Media display with zoom and positioning */}
              <div className="absolute inset-0 overflow-hidden">
                {(item.coverImageUrl || item.mediaUrl) ? (
                  item.type === 'reel' && !item.coverImageUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
                          transformOrigin: 'center',
                        }}
                        muted
                      />
                      <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                        ▶
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.coverImageUrl || item.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform"
                      style={{
                        transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
                        transformOrigin: 'center',
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    אין מדיה
                  </div>
                )}
              </div>
              
              {/* Editing controls overlay */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-3 z-20">
                  <div className="w-full space-y-4">
                    {/* Zoom control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="h-3 w-3" />
                          זום
                        </span>
                        <span>{Math.round(zoom * 100)}%</span>
                      </div>
                      <Slider
                        value={[zoom]}
                        onValueChange={([val]) => handleZoomChange(item.id, val)}
                        min={0.5}
                        max={2}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Position X control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>מיקום אופקי</span>
                        <span>{offsetX}%</span>
                      </div>
                      <Slider
                        value={[offsetX]}
                        onValueChange={([val]) => handleOffsetChange(item.id, val, offsetY)}
                        min={-30}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Position Y control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span>מיקום אנכי</span>
                        <span>{offsetY}%</span>
                      </div>
                      <Slider
                        value={[offsetY]}
                        onValueChange={([val]) => handleOffsetChange(item.id, offsetX, val)}
                        min={-30}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => setEditingItem(null)}
                      className="w-full mt-2 gap-2"
                    >
                      <Check className="h-3 w-3" />
                      סיום עריכה
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Admin overlay controls */}
              {isAdmin && !isEditing && (
                <div className={cn(
                  'absolute inset-0 bg-foreground/60 flex items-center justify-center gap-2 transition-opacity',
                  'opacity-0 group-hover:opacity-100'
                )}>
                  <button
                    onClick={() => handleCoverUploadClick(item.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="החלף תמונת קאבר"
                  >
                    <ImageIcon className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => setEditingItem(item.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="התאם זום ומיקום"
                  >
                    <Move className="h-4 w-4 text-white" />
                  </button>
                  <div className="p-2 bg-white/20 rounded-full cursor-grab">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              
              {/* Cover image indicator */}
              {item.coverImageUrl && !isEditing && (
                <div className="absolute top-1 right-1 bg-sand/80 text-foreground text-[9px] px-1.5 py-0.5 rounded">
                  קאבר
                </div>
              )}
              
              {/* Content type badge */}
              {!isEditing && (
                <div className={cn(
                  'absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded font-medium',
                  item.type === 'reel' && 'bg-royal-blue text-white',
                  item.type === 'story' && 'bg-sand text-foreground',
                  item.type === 'post' && 'bg-earth text-white'
                )}>
                  {item.type === 'reel' ? 'רילס' : item.type === 'story' ? 'סטורי' : 'פוסט'}
                </div>
              )}
            </div>
          );
        })}
        
        {clientContent.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground font-body">
            אין תוכן מאושר להצגה
          </div>
        )}
      </div>
    </div>
  );
}