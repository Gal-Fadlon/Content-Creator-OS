import { useState, useRef } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { CalendarView } from '@/components/CalendarView';
import { AssetModal } from '@/components/AssetModal';
import { FilterBar } from '@/components/FilterBar';
import { RoleToggle } from '@/components/RoleToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { ClientSelector } from '@/components/ClientSelector';
import { MonthlyThemeEditor } from '@/components/MonthlyThemeEditor';
import { InteractiveGridView } from '@/components/InteractiveGridView';
import { ClientEventRequestModal } from '@/components/ClientEventRequestModal';
import { StickerBank, StickerOverlay } from '@/components/StickerBank';
import { BackdropManager } from '@/components/BackdropManager';
import { Button } from '@/components/ui/button';
import { Grid3X3, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'calendar' | 'grid';

interface PlacedSticker {
  id: string;
  icon: React.ElementType;
  color: string;
  label: string;
  visibleId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

function DashboardContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showEventRequestModal, setShowEventRequestModal] = useState(false);
  const [monthlyBackdrop, setMonthlyBackdrop] = useState('');
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { userRole, clients, selectedClientId } = useApp();
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  const removeSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.visibleId !== id));
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Dynamic Monthly Backdrop */}
      {monthlyBackdrop && (
        <div 
          className="backdrop-overlay"
          style={{ backgroundImage: `url(${monthlyBackdrop})` }}
        />
      )}
      {!monthlyBackdrop && <div className="backdrop-overlay bg-background" />}
      
      {/* Sticker Bank for Admin */}
      <StickerBank 
        placedStickers={placedStickers}
        setPlacedStickers={setPlacedStickers}
      />
      
      {/* Top fixed title bar */}
      <div className="gradient-header text-header-foreground py-4 text-center shadow-soft relative z-10">
        <h1 className="text-xl font-display tracking-wide">ניהול ואסטרטגיית תוכן</h1>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Right side - Logo & Client */}
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-display font-bold text-foreground">
                Content OS
              </h2>
              {userRole === 'admin' && <ClientSelector />}
              {userRole === 'client' && selectedClient && (
                <span className="text-muted-foreground text-sm">
                  {selectedClient.name}
                </span>
              )}
            </div>
            
            {/* Left side - Actions */}
            <div className="flex items-center gap-3">
              {/* Backdrop Manager (Admin only) */}
              {userRole === 'admin' && (
                <BackdropManager 
                  currentBackdrop={monthlyBackdrop}
                  onBackdropChange={setMonthlyBackdrop}
                />
              )}
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-card rounded-xl p-1 shadow-card border border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'h-9 px-4 rounded-lg',
                    viewMode === 'calendar' && 'bg-sand/20 text-earth shadow-sm'
                  )}
                >
                  <Calendar className="h-4 w-4 ml-2" />
                  לוח שנה
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-9 px-4 rounded-lg',
                    viewMode === 'grid' && 'bg-sand/20 text-earth shadow-sm'
                  )}
                >
                  <Grid3X3 className="h-4 w-4 ml-2" />
                  גריד
                </Button>
              </div>
              
              <NotificationBell />
              <RoleToggle />
              
              {/* Client: Request new event button */}
              {userRole === 'client' && (
                <Button 
                  className="gap-2 gradient-gold text-foreground shadow-soft border border-sand/30"
                  onClick={() => setShowEventRequestModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  בקשת אירוע חדש
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Monthly Theme */}
      <div className="container mx-auto px-4 py-3 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <MonthlyThemeEditor />
      </div>
      
      {/* Filter Bar */}
      <div className="container mx-auto px-4 py-4 border-b border-border/30">
        <FilterBar />
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative" ref={calendarContainerRef}>
        {/* Sticker Overlay */}
        <StickerOverlay 
          stickers={placedStickers}
          onRemove={removeSticker}
          containerRef={calendarContainerRef}
        />
        
        {viewMode === 'calendar' ? (
          <CalendarView />
        ) : (
          <InteractiveGridView />
        )}
      </main>
      
      {/* Modals */}
      <AssetModal />
      <ClientEventRequestModal 
        open={showEventRequestModal} 
        onOpenChange={setShowEventRequestModal} 
      />
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
