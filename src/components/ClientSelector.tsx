import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Check, Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ClientSelector() {
  const { clients, selectedClientId, setSelectedClientId, userRole } = useApp();
  
  // Only show for admin
  if (userRole !== 'admin') return null;
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          {selectedClient ? selectedClient.name : 'בחר לקוח'}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>בחירת לקוח</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={cn(
                'w-full p-3 rounded-lg border border-border flex items-center gap-3 transition-all hover:bg-muted/50',
                selectedClientId === client.id && 'border-primary bg-muted/30'
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={client.avatarUrl} alt={client.name} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-right">
                <p className="font-medium">{client.name}</p>
                <p className="text-xs text-muted-foreground">
                  {client.pendingApprovals > 0 && (
                    <span className="text-status-pending">
                      {client.pendingApprovals} ממתינים לאישור
                    </span>
                  )}
                  {client.pendingApprovals === 0 && (
                    <span>{client.totalContent} פריטי תוכן</span>
                  )}
                </p>
              </div>
              {selectedClientId === client.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
