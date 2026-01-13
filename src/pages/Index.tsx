import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Grid3X3, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'calendar' | 'grid';

function DashboardContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showEventRequestModal, setShowEventRequestModal] = useState(false);
  const { userRole, clients, selectedClientId } = useApp();
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Top fixed title bar */}
      <div className="gradient-midnight text-header-foreground py-3 text-center shadow-soft">
        <h1 className="text-lg font-display tracking-wide">ניהול ואסטרטגיית תוכן</h1>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-card">
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
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1 shadow-card">
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
                <Button 
                  className="gap-2 gradient-gold text-midnight shadow-soft"
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
      <div className="container mx-auto px-4 py-3 border-b border-border bg-card/50">
        <MonthlyThemeEditor />
      </div>
      
      {/* Filter Bar */}
      <div className="container mx-auto px-4 py-4 border-b border-border">
        <FilterBar />
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
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
