import { useApp } from '@/context/AppContext';
import { useCalendarItem } from '@/hooks/useCalendarData';
import { isContentItem, isEventItem, ContentType, ContentStatus, MarkerColor } from '@/types/content';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Copy, Download, Upload, Check, FileImage, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function AssetModal() {
  const { selectedItemId, setSelectedItemId, selectedDate, setSelectedDate, userRole, updateContentItem, addContentItem, addEvent, updateEvent, deleteContentItem, deleteEvent, selectedClientId } = useApp();
  const item = useCalendarItem(selectedItemId);
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'media' | 'event'>('media');
  const [contentType, setContentType] = useState<ContentType>('reel');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [caption, setCaption] = useState('');
  const [creativeDescription, setCreativeDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventColor, setEventColor] = useState<MarkerColor>('black');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isOpen = !!selectedItemId || !!selectedDate;
  const isEditing = !!item;
  const isAdmin = userRole === 'admin';
  
  // Initialize form state when editing an existing item
  useEffect(() => {
    if (item) {
      if (isContentItem(item)) {
        setMode('media');
        setContentType(item.type);
        setStatus(item.status);
        setCaption(item.caption || '');
        setCreativeDescription(item.creativeDescription || '');
        setMediaPreview(item.mediaUrl || null);
      } else if (isEventItem(item)) {
        setMode('event');
        setEventTitle(item.title);
        setEventDescription(item.description || '');
        setEventColor(item.color);
      }
    }
  }, [item]);
  
  const handleClose = () => {
    setSelectedItemId(null);
    setSelectedDate(null);
    setCaption('');
    setCreativeDescription('');
    setEventTitle('');
    setEventDescription('');
    setMediaFile(null);
    setMediaPreview(null);
    setMode('media');
    setContentType('reel');
    setStatus('draft');
    setEventColor('black');
  };
  
  const handleDelete = () => {
    if (!item) return;
    
    if (isContentItem(item)) {
      deleteContentItem(item.id);
      toast({ title: 'נמחק!', description: 'התוכן נמחק בהצלחה' });
    } else if (isEventItem(item)) {
      deleteEvent(item.id);
      toast({ title: 'נמחק!', description: 'האירוע נמחק בהצלחה' });
    }
    handleClose();
  };
  
  const handleCopyCaption = () => {
    const textToCopy = isContentItem(item!) ? item.caption : '';
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'הועתק!', description: 'הקופי הועתק ללוח' });
  };
  
  const handleApprove = () => {
    if (item && isContentItem(item)) {
      updateContentItem(item.id, { status: 'approved' });
      toast({ title: 'אושר!', description: 'התוכן אושר לפרסום' });
      handleClose();
    }
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    
    toast({ 
      title: 'קובץ נבחר', 
      description: file.name 
    });
  };
  
  const handleSave = () => {
    if (!selectedClientId) return;
    
    if (mode === 'media') {
      const dateStr = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      
      if (isEditing && isContentItem(item!)) {
        updateContentItem(item.id, {
          status,
          caption,
          creativeDescription,
          mediaUrl: mediaPreview || item.mediaUrl,
        });
      } else {
        addContentItem({
          clientId: selectedClientId,
          type: contentType,
          status,
          platform: 'instagram',
          date: dateStr,
          caption,
          creativeDescription,
          mediaUrl: mediaPreview || undefined,
          mediaType: mediaFile?.type.startsWith('video') ? 'video' : 'image',
        });
      }
      
      toast({ title: 'נשמר!', description: 'התוכן נשמר בהצלחה' });
    } else {
      const dateStr = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      
      if (isEditing && isEventItem(item!)) {
        updateEvent(item.id, {
          title: eventTitle,
          description: eventDescription,
          color: eventColor,
        });
      } else {
        addEvent({
          clientId: selectedClientId,
          title: eventTitle,
          description: eventDescription,
          date: dateStr,
          color: eventColor,
        });
      }
      
      toast({ title: 'נשמר!', description: 'האירוע נשמר בהצלחה' });
    }
    
    handleClose();
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const displayDate = selectedDate || (item ? new Date(isContentItem(item) ? item.date : item.date) : new Date());
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden shadow-soft">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Dark header with gradient */}
        <div className="gradient-midnight text-header-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handleClose} className="hover:opacity-70 transition-opacity">
              <X className="h-5 w-5" />
            </button>
            {isAdmin && isEditing && (
              <button onClick={handleDelete} className="hover:opacity-70 transition-opacity text-red-400">
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          <DialogTitle className="text-lg font-medium">
            {formatDate(displayDate)}
          </DialogTitle>
        </div>
        
        <div className="p-6 space-y-6 gradient-soft">
          {/* Mode toggle - only for new items */}
          {!isEditing && isAdmin && (
            <div className="flex gap-2">
              <Button
                variant={mode === 'media' ? 'default' : 'outline'}
                onClick={() => setMode('media')}
                className="flex-1 rounded-full shadow-card"
              >
                תוכן מדיה
              </Button>
              <Button
                variant={mode === 'event' ? 'default' : 'outline'}
                onClick={() => setMode('event')}
                className="flex-1 rounded-full shadow-card"
              >
                אירוע / הערה
              </Button>
            </div>
          )}
          
          {/* Content view/edit */}
          {(mode === 'media' || (isEditing && isContentItem(item!))) && (
            <>
              {/* Type selector (admin only for new) */}
              {isAdmin && !isEditing && (
                <div className="flex gap-2">
                  {(['post', 'story', 'reel'] as ContentType[]).map((type) => (
                    <Button
                      key={type}
                      variant={contentType === type ? 'default' : 'outline'}
                      onClick={() => setContentType(type)}
                      className={cn(
                        'flex-1 rounded-full uppercase shadow-card',
                        contentType === type && 'gradient-gold text-midnight'
                      )}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Status selector (admin only) */}
              {isAdmin && (
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">סטטוס עבודה</Label>
                  <Select 
                    value={isEditing && isContentItem(item!) ? item.status : status} 
                    onValueChange={(v) => setStatus(v as ContentStatus)}
                  >
                    <SelectTrigger className="shadow-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">טיוטה</SelectItem>
                      <SelectItem value="pending">ממתין לאישור</SelectItem>
                      <SelectItem value="approved">אושר לפרסום</SelectItem>
                      <SelectItem value="published">פורסם</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Media preview or upload */}
              {isEditing && isContentItem(item!) && item.mediaUrl ? (
                <div className="relative rounded-lg overflow-hidden bg-muted aspect-video shadow-card">
                  <img src={mediaPreview || item.mediaUrl} alt="" className="w-full h-full object-cover" />
                  {!isAdmin && (
                    <Button size="icon" variant="secondary" className="absolute bottom-2 left-2 shadow-soft">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-2 right-2 shadow-soft"
                      onClick={handleFileClick}
                    >
                      <FileImage className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : isAdmin ? (
                <button
                  onClick={handleFileClick}
                  className={cn(
                    'w-full border-2 border-dashed border-gold/40 rounded-lg p-8 text-center',
                    'hover:border-gold hover:bg-gold/5 transition-all cursor-pointer shadow-card',
                    mediaPreview && 'border-solid border-gold bg-gold/5'
                  )}
                >
                  {mediaPreview ? (
                    <div className="space-y-2">
                      <img src={mediaPreview} alt="" className="w-full h-32 object-cover rounded" />
                      <p className="text-sm text-gold">לחץ להחלפת הקובץ</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-gold/60 mb-2" />
                      <p className="text-gold/80 text-sm font-medium">גרור קובץ או לחץ כאן להעלאה</p>
                    </>
                  )}
                </button>
              ) : null}
              
              {/* Creative Description - for admin to describe to client */}
              {isAdmin && (
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">תיאור הקריאייטיב</Label>
                  <Textarea
                    value={isEditing && isContentItem(item!) ? item.creativeDescription || '' : creativeDescription}
                    onChange={(e) => setCreativeDescription(e.target.value)}
                    placeholder="תיאור פנימי עבור הלקוח (למשל: סרטון אווירה עם מעברים מהירים)"
                    className="min-h-[60px] shadow-card bg-gold/5 border-gold/20"
                  />
                </div>
              )}
              
              {/* Show creative description to client (read-only) */}
              {!isAdmin && isEditing && isContentItem(item!) && item.creativeDescription && (
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">תיאור הקריאייטיב</Label>
                  <div className="bg-gold/10 p-3 rounded-lg text-sm border border-gold/20">
                    {item.creativeDescription}
                  </div>
                </div>
              )}
              
              {/* Caption - show current value in edit mode */}
              {isEditing && isContentItem(item!) ? (
                isAdmin ? (
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">קופי</Label>
                    <Textarea 
                      value={caption} 
                      onChange={(e) => setCaption(e.target.value)} 
                      placeholder="כתבו את הקופי כאן..."
                      className="min-h-[100px] shadow-card"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Button size="sm" variant="ghost" onClick={handleCopyCaption} className="text-gold hover:text-gold hover:bg-gold/10">
                        <Copy className="h-4 w-4 ml-1" />
                        העתק
                      </Button>
                      <Label className="text-charcoal font-medium">קופי</Label>
                    </div>
                    <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap shadow-card">
                      {item.caption}
                    </div>
                  </div>
                )
              ) : isAdmin && (
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">קופי</Label>
                  <Textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    placeholder="כתבו את הקופי כאן..."
                    className="min-h-[100px] shadow-card"
                  />
                </div>
              )}
              
              {/* Client approve button */}
              {!isAdmin && isEditing && isContentItem(item!) && item.status === 'pending' && (
                <Button onClick={handleApprove} className="w-full gradient-gold text-midnight shadow-soft" size="lg">
                  <Check className="h-4 w-4 ml-2" />
                  אישור תוכן
                </Button>
              )}
            </>
          )}
          
          {/* Event view/edit */}
          {(mode === 'event' || (isEditing && isEventItem(item!))) && (
            <>
              <div className="space-y-2">
                <Label className="text-charcoal font-medium">כותרת האירוע</Label>
                <Input 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="למשל: יום צילום בסטודיו"
                  disabled={!isAdmin}
                  className="shadow-card"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-charcoal font-medium">תיאור / הערות</Label>
                <Textarea 
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="פרטים נוספים..."
                  disabled={!isAdmin}
                  className="shadow-card"
                />
              </div>
              
              {isAdmin && (
                <div className="space-y-2">
                  <Label className="text-charcoal font-medium">צבע מזהה</Label>
                  <div className="flex gap-2 justify-end">
                    {(['red', 'blue', 'beige', 'brown', 'black'] as MarkerColor[]).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEventColor(color)}
                        className={cn(
                          'w-10 h-10 rounded-full transition-all shadow-card',
                          `bg-marker-${color}`,
                          eventColor === color && 'ring-2 ring-offset-2 ring-gold'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Save button (admin only) */}
          {isAdmin && (
            <Button onClick={handleSave} className="w-full gradient-midnight text-white shadow-soft" size="lg">
              שמור שינויים
            </Button>
          )}
          
          {/* Info for client when viewing new date (they should use the + button) */}
          {!isAdmin && !isEditing && (
            <div className="text-center text-muted-foreground py-4">
              <p>השתמש בכפתור "+" בתפריט העליון</p>
              <p className="text-sm">כדי לבקש אירוע חדש</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}