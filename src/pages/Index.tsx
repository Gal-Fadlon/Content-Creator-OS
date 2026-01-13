import { useRef } from 'react';
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
import { useState } from 'react';

type ViewMode = 'calendar' | 'grid';

function DashboardContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showEventRequestModal, setShowEventRequestModal] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { userRole, clients, selectedClientId, getCurrentMonthState } = useApp();
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const monthState = getCurrentMonthState();
  const monthlyBackdrop = monthState.backdrop;
  
  return (
    <div className="min-h-screen relative">
      {/* Dynamic Monthly Backdrop - unique per month */}
      {monthlyBackdrop && (
        <div 
          className="backdrop-overlay"
          style={{ backgroundImage: `url(${monthlyBackdrop})` }}
        />
      )}
      {!monthlyBackdrop && <div className="backdrop-overlay bg-background" />}
      
      {/* Sticker Bank for Admin */}
      <StickerBank />
      
      {/* Sticker Overlay - renders placed stickers */}
      <StickerOverlay containerRef={calendarContainerRef} />
      
      {/* Top fixed brand header - RZ Digital Agency */}
      <div className="gradient-header text-header-foreground py-5 text-center shadow-soft relative z-10">
        <h1 className="font-brand text-2xl tracking-[0.2em]">rz digital agency</h1>
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
                <span className="text-muted-foreground text-sm font-body">
                  {selectedClient.name}
                </span>
              )}
            </div>
            
            {/* Left side - Actions */}
            <div className="flex items-center gap-3">
              {/* Backdrop Manager (Admin only) */}
              {userRole === 'admin' && <BackdropManager />}
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-card rounded-xl p-1 shadow-card border border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'h-9 px-4 rounded-lg font-body',
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
                    'h-9 px-4 rounded-lg font-body',
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
                  className="gap-2 gradient-gold text-foreground shadow-soft border border-sand/30 font-body"
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