import { useApp } from '@/context/AppContext';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ContentBadge, StatusBadge } from '@/components/ui/content-badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAYS_HE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_EN = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export function CalendarView() {
  const { currentMonth, setCurrentMonth, setSelectedDate, setSelectedItemId, clients, selectedClientId } = useApp();
  const { calendarDays } = useCalendarData();
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleItemClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="font-display text-5xl font-bold tracking-wide text-foreground/80">
              {MONTHS_EN[currentMonth.getMonth()]}
            </h1>
            <span className="text-6xl font-display font-light text-foreground/40">
              {currentMonth.getFullYear()}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        {selectedClient && (
          <p className="text-muted-foreground">
            <span className="font-medium">נושא חודשי - CORE</span>
            <span className="mx-2">|</span>
            <span>{selectedClient.monthlyTheme}</span>
          </p>
        )}
      </div>
      
      {/* Calendar Grid */}
      <div className="flex-1 px-4 pb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_HE.map((day) => (
            <div key={day} className="text-center py-2 font-medium text-foreground/70">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={cn(
                'min-h-[100px] p-2 rounded-lg border border-border bg-card transition-all hover:border-foreground/30 text-right',
                !day.isCurrentMonth && 'opacity-40'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                day.date.toDateString() === new Date().toDateString() && 'text-primary font-bold'
              )}>
                {day.date.getDate()}
              </span>
              
              {/* Content items */}
              <div className="mt-1 space-y-1">
                {day.content.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => handleItemClick(item.id, e)}
                    className="cursor-pointer"
                  >
                    <ContentBadge type={item.type} className="w-full text-[10px] py-0.5" />
                    {item.status === 'approved' && (
                      <span className="text-[9px] text-muted-foreground block mt-0.5">אושר</span>
                    )}
                  </div>
                ))}
                {day.content.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{day.content.length - 2} נוספים
                  </span>
                )}
                
                {/* Events */}
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleItemClick(event.id, e)}
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full truncate cursor-pointer',
                      `bg-marker-${event.color} text-white`
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
