import { useApp } from '@/context/AppContext';
import { useCalendarItem } from '@/hooks/useCalendarData';
import { isContentItem, isEventItem, ContentType, ContentStatus, MarkerColor } from '@/types/content';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Copy, Download, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function AssetModal() {
  const { selectedItemId, setSelectedItemId, selectedDate, setSelectedDate, userRole, updateContentItem, addContentItem, addEvent } = useApp();
  const item = useCalendarItem(selectedItemId);
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'media' | 'event'>('media');
  const [contentType, setContentType] = useState<ContentType>('reel');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [caption, setCaption] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventColor, setEventColor] = useState<MarkerColor>('black');
  
  const isOpen = !!selectedItemId || !!selectedDate;
  const isEditing = !!item;
  const isAdmin = userRole === 'admin';
  
  const handleClose = () => {
    setSelectedItemId(null);
    setSelectedDate(null);
    setCaption('');
    setEventTitle('');
    setEventDescription('');
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
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const displayDate = selectedDate || (item ? new Date(isContentItem(item) ? item.date : item.date) : new Date());
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Dark header */}
        <div className="bg-header text-header-foreground p-4 flex items-center justify-between">
          <button onClick={handleClose} className="hover:opacity-70">
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-lg font-medium">
            {formatDate(displayDate)}
          </DialogTitle>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Mode toggle - only for new items */}
          {!isEditing && isAdmin && (
            <div className="flex gap-2">
              <Button
                variant={mode === 'media' ? 'default' : 'outline'}
                onClick={() => setMode('media')}
                className="flex-1 rounded-full"
              >
                תוכן מדיה
              </Button>
              <Button
                variant={mode === 'event' ? 'default' : 'outline'}
                onClick={() => setMode('event')}
                className="flex-1 rounded-full"
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
                      className="flex-1 rounded-full uppercase"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Status selector (admin only) */}
              {isAdmin && (
                <div className="space-y-2">
                  <Label>סטטוס עבודה</Label>
                  <Select value={isEditing && isContentItem(item!) ? item.status : status} onValueChange={(v) => setStatus(v as ContentStatus)}>
                    <SelectTrigger>
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
                <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                  <img src={item.mediaUrl} alt="" className="w-full h-full object-cover" />
                  {!isAdmin && (
                    <Button size="icon" variant="secondary" className="absolute bottom-2 left-2">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : isAdmin ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">גרור קובץ או לחץ כאן להעלאה</p>
                </div>
              ) : null}
              
              {/* Caption */}
              {isEditing && isContentItem(item!) ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="ghost" onClick={handleCopyCaption}>
                      <Copy className="h-4 w-4 ml-1" />
                      העתק
                    </Button>
                    <Label>קופי</Label>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap">
                    {item.caption}
                  </div>
                </div>
              ) : isAdmin && (
                <div className="space-y-2">
                  <Label>קופי</Label>
                  <Textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    placeholder="כתבו את הקופי כאן..."
                    className="min-h-[100px]"
                  />
                </div>
              )}
              
              {/* Client approve button */}
              {!isAdmin && isEditing && isContentItem(item!) && item.status === 'pending' && (
                <Button onClick={handleApprove} className="w-full" size="lg">
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
                <Label>כותרת האירוע</Label>
                <Input 
                  value={isEditing && isEventItem(item!) ? item.title : eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="למשל: יום צילום בסטודיו"
                  disabled={!isAdmin}
                />
              </div>
              
              <div className="space-y-2">
                <Label>תיאור / הערות</Label>
                <Textarea 
                  value={isEditing && isEventItem(item!) ? item.description || '' : eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="פרטים נוספים..."
                  disabled={!isAdmin}
                />
              </div>
              
              {isAdmin && (
                <div className="space-y-2">
                  <Label>צבע מזהה</Label>
                  <div className="flex gap-2 justify-end">
                    {(['red', 'blue', 'beige', 'brown', 'black'] as MarkerColor[]).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEventColor(color)}
                        className={cn(
                          'w-10 h-10 rounded-full transition-all',
                          `bg-marker-${color}`,
                          eventColor === color && 'ring-2 ring-offset-2 ring-foreground'
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
            <Button className="w-full" size="lg">
              שמור שינויים
            </Button>
          )}
          
          {/* Request new content button (client only for new) */}
          {!isAdmin && !isEditing && (
            <Button className="w-full" size="lg">
              בקשת אירוע חדש
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
