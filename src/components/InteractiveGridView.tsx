import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Upload, GripVertical, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface GridItem {
  id: string;
  mediaUrl?: string;
  coverImageUrl?: string;
  type: 'post' | 'story' | 'reel';
  gridOrder?: number;
}

export function InteractiveGridView() {
  const { contentItems, selectedClientId, userRole, updateContentItem } = useApp();
  const { toast } = useToast();
  const isAdmin = userRole === 'admin';
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
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
    if (!isAdmin) return;
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
    
    // Find indices
    const draggedIndex = clientContent.findIndex(item => item.id === draggedItem);
    const targetIndex = clientContent.findIndex(item => item.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Reorder items
    const newOrder = [...clientContent];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    // Update gridOrder for all affected items
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
    
    // Create a local URL for the uploaded image
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
  
  return (
    <div className="space-y-4">
      {isAdmin && (
        <p className="text-sm text-muted-foreground text-center">
          גרור פריטים כדי לשנות את הסדר • לחץ על אייקון התמונה להחלפת קאבר
        </p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1 max-w-4xl mx-auto">
        {clientContent.map((item) => (
          <div
            key={item.id}
            draggable={isAdmin}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              'aspect-square bg-muted rounded-sm overflow-hidden relative group transition-all',
              isAdmin && 'cursor-grab active:cursor-grabbing',
              draggedItem === item.id && 'opacity-50 scale-95',
              dragOverItem === item.id && 'ring-2 ring-gold ring-offset-2'
            )}
          >
            {/* Media display - prefer cover image if available */}
            {(item.coverImageUrl || item.mediaUrl) ? (
              item.type === 'reel' && !item.coverImageUrl ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
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
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                אין מדיה
              </div>
            )}
            
            {/* Admin overlay controls */}
            {isAdmin && (
              <div className={cn(
                'absolute inset-0 bg-midnight/60 flex items-center justify-center gap-2 transition-opacity',
                'opacity-0 group-hover:opacity-100'
              )}>
                <button
                  onClick={() => handleCoverUploadClick(item.id)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="החלף תמונת קאבר"
                >
                  <ImageIcon className="h-4 w-4 text-white" />
                </button>
                <div className="p-2 bg-white/20 rounded-full cursor-grab">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            
            {/* Cover image indicator */}
            {item.coverImageUrl && (
              <div className="absolute top-1 right-1 bg-gold/80 text-midnight text-[9px] px-1.5 py-0.5 rounded">
                קאבר
              </div>
            )}
          </div>
        ))}
        
        {clientContent.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            אין תוכן מאושר להצגה
          </div>
        )}
      </div>
    </div>
  );
}