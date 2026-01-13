import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ClientEventRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientEventRequestModal({ open, onOpenChange }: ClientEventRequestModalProps) {
  const { selectedClientId, addEventRequest } = useApp();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>();
  
  const handleSubmit = () => {
    if (!title.trim() || !date || !selectedClientId) {
      toast({
        title: 'שגיאה',
        description: 'יש למלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }
    
    addEventRequest({
      clientId: selectedClientId,
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      description: description.trim() || undefined,
      status: 'pending',
    });
    
    toast({
      title: 'הבקשה נשלחה!',
      description: 'המנהל יקבל התראה על הבקשה שלך',
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate(undefined);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">בקשה לאירוע חדש</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">שם האירוע *</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: יום צילום, השקת מוצר..."
              className="shadow-card"
            />
          </div>
          
          <div className="space-y-2">
            <Label>תאריך מבוקש *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right shadow-card"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? format(date, 'dd בMMMM yyyy', { locale: he }) : 'בחר תאריך'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-description">תיאור (אופציונלי)</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="פרטים נוספים על האירוע..."
              className="min-h-[80px] shadow-card"
            />
          </div>
          
          <Button onClick={handleSubmit} className="w-full gradient-gold text-midnight" size="lg">
            <Send className="h-4 w-4 ml-2" />
            שלח בקשה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}