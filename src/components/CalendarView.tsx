import { useApp } from '@/context/AppContext';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ContentBadge, StatusBadge } from '@/components/ui/content-badge';
import { ChevronLeft, ChevronRight, Film, Image, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const MONTHS_EN = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

// Content type icon mapping
const ContentTypeIcon = ({ type }: { type: 'post' | 'story' | 'reel' }) => {
  switch (type) {
    case 'reel':
      return <Film className="h-3 w-3" />;
    case 'story':
      return <Square className="h-3 w-3" />;
    case 'post':
      return <Image className="h-3 w-3" />;
    default:
      return null;
  }
};

export function CalendarView() {
  const { currentMonth, setCurrentMonth, setSelectedDate, setSelectedItemId, getCurrentMonthState } = useApp();
  const { calendarDays } = useCalendarData();
  
  const monthState = getCurrentMonthState();
  
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
              <p className="text-lg text-muted-foreground mt-1 tracking-widest font-body">
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
          
          {/* Monthly theme with handwritten style - from per-month state */}
          {monthState.theme && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">נושא חודשי</span>
              <p className="handwritten text-2xl text-royal-blue mt-1">
                {monthState.theme}
              </p>
            </div>
          )}
        </div>
        
        {/* Calendar Grid */}
        <div className="p-4 md:p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-3">
            {DAYS_HE.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground font-body">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              // Get the first content item with media for this day
              const contentWithMedia = day.content.find(item => item.mediaUrl || item.coverImageUrl || item.thumbnailUrl);
              const thumbnailUrl = contentWithMedia?.coverImageUrl || contentWithMedia?.thumbnailUrl || contentWithMedia?.mediaUrl;
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day.date)}
                  className={cn(
                    'min-h-[90px] md:min-h-[110px] p-2 rounded-xl border transition-all text-right relative overflow-hidden',
                    'border-border/30 hover:border-sand',
                    !day.isCurrentMonth && 'opacity-30',
                    day.date.toDateString() === new Date().toDateString() && 'ring-2 ring-royal-blue/30 border-royal-blue/50'
                  )}
                >
                  {/* Background image from content */}
                  {thumbnailUrl && day.isCurrentMonth && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{ backgroundImage: `url(${thumbnailUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    </div>
                  )}
                  
                  {/* Day number as overlay */}
                  <div className="relative z-10">
                    <span className={cn(
                      'text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                      day.date.toDateString() === new Date().toDateString() && 'bg-royal-blue text-white',
                      thumbnailUrl && day.isCurrentMonth && 'text-white bg-black/40',
                      !thumbnailUrl && 'bg-card/50'
                    )}>
                      {day.date.getDate()}
                    </span>
                    
                    {/* Content type icons as overlay */}
                    {day.content.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {day.content.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={(e) => handleItemClick(item.id, e)}
                            className={cn(
                              'cursor-pointer p-1 rounded transition-transform hover:scale-110',
                              thumbnailUrl ? 'bg-white/90 text-foreground' : 'bg-muted',
                              item.type === 'reel' && !thumbnailUrl && 'bg-royal-blue/20 text-royal-blue',
                              item.type === 'story' && !thumbnailUrl && 'bg-sand/30 text-earth',
                              item.type === 'post' && !thumbnailUrl && 'bg-earth/20 text-earth'
                            )}
                            title={item.type === 'reel' ? 'רילס' : item.type === 'story' ? 'סטורי' : 'פוסט'}
                          >
                            <ContentTypeIcon type={item.type} />
                          </div>
                        ))}
                        {day.content.length > 3 && (
                          <span className={cn(
                            'text-[10px] px-1 rounded',
                            thumbnailUrl ? 'text-white' : 'text-muted-foreground'
                          )}>
                            +{day.content.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Events */}
                    {day.events.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => handleItemClick(event.id, e)}
                            className={cn(
                              'text-[9px] px-1.5 py-0.5 rounded-full truncate cursor-pointer transition-transform hover:scale-105',
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
                        {day.events.length > 2 && (
                          <span className={cn(
                            'text-[9px]',
                            thumbnailUrl ? 'text-white/80' : 'text-muted-foreground'
                          )}>
                            +{day.events.length - 2} אירועים
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}