import { useApp } from '@/context/AppContext';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ContentBadge, StatusBadge } from '@/components/ui/content-badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
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
    <div className="relative">
      {/* Paper Card Effect */}
      <div className="paper-card rounded-2xl overflow-hidden">
        {/* Header with month display */}
        <div className="text-center py-10 px-6 border-b border-border/30">
          <div className="flex items-center justify-center gap-6 mb-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextMonth}
              className="hover:bg-sand/20 rounded-full"
            >
              <ChevronRight className="h-6 w-6 text-earth" />
            </Button>
            
            <div className="text-center">
              {/* Month name - large serif */}
              <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-wide text-foreground">
                {MONTHS_EN[currentMonth.getMonth()]}
              </h1>
              {/* Year - small and subtle */}
              <p className="text-lg text-muted-foreground mt-1 tracking-widest">
                {currentMonth.getFullYear()}
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPreviousMonth}
              className="hover:bg-sand/20 rounded-full"
            >
              <ChevronLeft className="h-6 w-6 text-earth" />
            </Button>
          </div>
          
          {/* Monthly theme with handwritten style */}
          {selectedClient && selectedClient.monthlyTheme && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">נושא חודשי</span>
              <p className="handwritten text-2xl text-royal-blue mt-1">
                {selectedClient.monthlyTheme}
              </p>
            </div>
          )}
        </div>
        
        {/* Calendar Grid */}
        <div className="p-4 md:p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-3">
            {DAYS_HE.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayClick(day.date)}
                className={cn(
                  'min-h-[90px] md:min-h-[110px] p-2 rounded-xl border transition-all text-right',
                  'bg-card/50 border-border/30 hover:border-sand hover:bg-sand/5',
                  !day.isCurrentMonth && 'opacity-30',
                  day.date.toDateString() === new Date().toDateString() && 'ring-2 ring-royal-blue/30 border-royal-blue/50'
                )}
              >
                <span className={cn(
                  'text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                  day.date.toDateString() === new Date().toDateString() && 'bg-royal-blue text-white'
                )}>
                  {day.date.getDate()}
                </span>
                
                {/* Content items */}
                <div className="mt-2 space-y-1">
                  {day.content.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => handleItemClick(item.id, e)}
                      className="cursor-pointer group"
                    >
                      <ContentBadge type={item.type} className="w-full text-[10px] py-0.5 group-hover:scale-105 transition-transform" />
                    </div>
                  ))}
                  {day.content.length > 2 && (
                    <span className="text-[10px] text-muted-foreground block">
                      +{day.content.length - 2} נוספים
                    </span>
                  )}
                  
                  {/* Events */}
                  {day.events.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleItemClick(event.id, e)}
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full truncate cursor-pointer transition-transform hover:scale-105',
                        event.color === 'red' && 'bg-burgundy text-white',
                        event.color === 'blue' && 'bg-royal-blue text-white',
                        event.color === 'beige' && 'bg-sand text-foreground',
                        event.color === 'brown' && 'bg-earth text-white',
                        event.color === 'black' && 'bg-foreground text-background'
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
    </div>
  );
}
