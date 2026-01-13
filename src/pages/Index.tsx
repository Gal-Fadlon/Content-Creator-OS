import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { CalendarView } from '@/components/CalendarView';
import { AssetModal } from '@/components/AssetModal';
import { FilterBar } from '@/components/FilterBar';
import { RoleToggle } from '@/components/RoleToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { ClientSelector } from '@/components/ClientSelector';
import { Button } from '@/components/ui/button';
import { Grid3X3, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'calendar' | 'grid';

function InstagramGridView() {
  const { contentItems, selectedClientId } = useApp();
  
  const clientContent = contentItems
    .filter(item => item.clientId === selectedClientId && item.status === 'approved')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-1 max-w-4xl mx-auto">
      {clientContent.map((item) => (
        <div 
          key={item.id} 
          className="aspect-square bg-muted rounded-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          {item.mediaUrl ? (
            item.type === 'reel' ? (
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
                src={item.mediaUrl} 
                alt={item.caption?.slice(0, 30) || 'Content'} 
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              אין מדיה
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
  );
}

function DashboardContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const { userRole, clients, selectedClientId } = useApp();
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Right side - Logo & Client */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-display font-bold text-foreground">
                Content OS
              </h1>
              {userRole === 'admin' && <ClientSelector />}
              {userRole === 'client' && selectedClient && (
                <span className="text-muted-foreground text-sm">
                  {selectedClient.name}
                </span>
              )}
            </div>
            
            {/* Left side - Actions */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'h-8 px-3',
                    viewMode === 'calendar' && 'bg-background shadow-sm'
                  )}
                >
                  <Calendar className="h-4 w-4 ml-1" />
                  לוח שנה
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-8 px-3',
                    viewMode === 'grid' && 'bg-background shadow-sm'
                  )}
                >
                  <Grid3X3 className="h-4 w-4 ml-1" />
                  גריד
                </Button>
              </div>
              
              <NotificationBell />
              <RoleToggle />
              
              {/* Client: Request new event button */}
              {userRole === 'client' && (
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  בקשת אירוע חדש
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Filter Bar */}
      <div className="container mx-auto px-4 py-4 border-b border-border">
        <FilterBar />
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'calendar' ? (
          <CalendarView />
        ) : (
          <InstagramGridView />
        )}
      </main>
      
      {/* Asset Modal */}
      <AssetModal />
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
};

export default Index;
