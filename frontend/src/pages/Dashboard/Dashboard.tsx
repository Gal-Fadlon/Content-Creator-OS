import { useRef } from 'react';
import { useMonthlyState } from '@/context/providers/MonthlyStateProvider';
import { useEventRequestModal } from '@/context/providers/ModalProvider';
import { useViewMode } from '@/context/providers/ViewModeProvider';

// Layout components
import BrandHeader from '@/components/layout/BrandHeader/BrandHeader';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import MonthlyThemeEditor from '@/components/layout/MonthlyThemeEditor/MonthlyThemeEditor';

// Feature components
import FilterBar from '@/components/features/filter/FilterBar/FilterBar';
import CalendarView from '@/components/features/calendar/CalendarView/CalendarView';
import InteractiveGridView from '@/components/features/grid/GridView/GridView';
import ContentModal from '@/components/features/content/ContentModal/ContentModal';
import StickerBank from '@/components/features/stickers/StickerBank/StickerBank';
import StickerOverlay from '@/components/features/stickers/StickerOverlay/StickerOverlay';
import ClientEventRequestModal from '@/components/features/events/ClientEventRequestModal/ClientEventRequestModal';

// Styles
import {
  StyledBackdropOverlay,
  StyledPageContainer,
  StyledThemeSection,
  StyledThemeContainer,
  StyledFilterSection,
  StyledFilterContainer,
  StyledMainContainer,
} from './Dashboard.style';

function Dashboard() {
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const { currentMonthState } = useMonthlyState();
  const { viewMode, setViewMode } = useViewMode();
  const eventRequestModal = useEventRequestModal();

  const monthlyBackdrop = currentMonthState.backdrop;

  return (
    <StyledPageContainer>
      {/* Dynamic Monthly Backdrop */}
      {monthlyBackdrop ? (
        <StyledBackdropOverlay
          hasImage
          sx={{ backgroundImage: `url(${monthlyBackdrop})` }}
        />
      ) : (
        <StyledBackdropOverlay />
      )}

      {/* Sticker Bank for Admin */}
      <StickerBank />

      {/* Sticker Overlay */}
      <StickerOverlay containerRef={calendarContainerRef} />

      {/* Brand Header */}
      <BrandHeader />

      {/* App Header */}
      <AppHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRequestEvent={() => eventRequestModal.open()}
      />

      {/* Monthly Theme */}
      <StyledThemeSection>
        <StyledThemeContainer maxWidth="xl">
          <MonthlyThemeEditor />
        </StyledThemeContainer>
      </StyledThemeSection>

      {/* Filter Bar */}
      <StyledFilterSection>
        <StyledFilterContainer maxWidth="xl">
          <FilterBar />
        </StyledFilterContainer>
      </StyledFilterSection>

      {/* Main Content */}
      <StyledMainContainer
        maxWidth="xl"
        ref={calendarContainerRef}
      >
        {viewMode === 'calendar' ? <CalendarView /> : <InteractiveGridView />}
      </StyledMainContainer>

      {/* Modals */}
      <ContentModal />
      <ClientEventRequestModal
        open={eventRequestModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            eventRequestModal.close();
          }
        }}
        initialDate={eventRequestModal.initialDate}
      />
    </StyledPageContainer>
  );
}

export default Dashboard;
