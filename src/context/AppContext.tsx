import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, UserRole, Client, ContentItem, EventItem, Notification, ContentFilters, CalendarView, EventRequest, MonthlyState, PlacedSticker, CustomSticker } from '@/types/content';
import { mockUsers, mockClients, mockContentItems, mockEvents, mockNotifications } from '@/data/mockData';

// Helper to generate month key
const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

interface AppState {
  // User & Role
  currentUser: User;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Client selection
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  clients: Client[];
  updateClientTheme: (clientId: string, theme: string) => void;
  
  // Content & Events
  contentItems: ContentItem[];
  events: EventItem[];
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  
  // Event Requests (from clients)
  eventRequests: EventRequest[];
  addEventRequest: (request: Omit<EventRequest, 'id' | 'createdAt'>) => void;
  approveEventRequest: (id: string) => void;
  rejectEventRequest: (id: string) => void;
  
  // Filters
  filters: ContentFilters;
  setFilters: (filters: ContentFilters) => void;
  
  // View
  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  
  // Monthly State (per-month backdrop and stickers)
  monthlyStates: Record<string, MonthlyState>;
  getCurrentMonthState: () => MonthlyState;
  setMonthlyBackdrop: (backdrop: string) => void;
  setMonthlyStickers: (stickers: PlacedSticker[]) => void;
  addCustomSticker: (sticker: Omit<CustomSticker, 'id' | 'createdAt'>) => void;
  removeCustomSticker: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  
  // Modal states
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // User state - default to admin for demo
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const currentUser = userRole === 'admin' ? mockUsers[0] : mockUsers[1];
  
  // Client selection
  const [selectedClientId, setSelectedClientId] = useState<string | null>('c1');
  const [clients, setClients] = useState<Client[]>(mockClients);
  
  // Content & Events state
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  
  // Event Requests
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  
  // Filters
  const [filters, setFilters] = useState<ContentFilters>({});
  
  // View state
  const [calendarView, setCalendarView] = useState<CalendarView>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  
  // Monthly States - separate state per month
  const [monthlyStates, setMonthlyStates] = useState<Record<string, MonthlyState>>({});
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Modal states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Client theme update
  const updateClientTheme = (clientId: string, theme: string) => {
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, monthlyTheme: theme }
          : client
      )
    );
  };
  
  // Get current month state
  const getCurrentMonthState = useCallback((): MonthlyState => {
    const monthKey = getMonthKey(currentMonth);
    return monthlyStates[monthKey] || {
      monthKey,
      backdrop: '',
      stickers: [],
      customStickerBank: [],
    };
  }, [currentMonth, monthlyStates]);
  
  // Set monthly backdrop (only for current month)
  const setMonthlyBackdrop = useCallback((backdrop: string) => {
    const monthKey = getMonthKey(currentMonth);
    setMonthlyStates(prev => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        monthKey,
        backdrop,
        stickers: prev[monthKey]?.stickers || [],
        customStickerBank: prev[monthKey]?.customStickerBank || [],
      },
    }));
  }, [currentMonth]);
  
  // Set monthly stickers (only for current month)
  const setMonthlyStickers = useCallback((stickers: PlacedSticker[]) => {
    const monthKey = getMonthKey(currentMonth);
    setMonthlyStates(prev => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        monthKey,
        backdrop: prev[monthKey]?.backdrop || '',
        stickers,
        customStickerBank: prev[monthKey]?.customStickerBank || [],
      },
    }));
  }, [currentMonth]);
  
  // Add custom sticker to bank
  const addCustomSticker = useCallback((sticker: Omit<CustomSticker, 'id' | 'createdAt'>) => {
    const monthKey = getMonthKey(currentMonth);
    const newSticker: CustomSticker = {
      ...sticker,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMonthlyStates(prev => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        monthKey,
        backdrop: prev[monthKey]?.backdrop || '',
        stickers: prev[monthKey]?.stickers || [],
        customStickerBank: [...(prev[monthKey]?.customStickerBank || []), newSticker],
      },
    }));
  }, [currentMonth]);
  
  // Remove custom sticker from bank
  const removeCustomSticker = useCallback((id: string) => {
    const monthKey = getMonthKey(currentMonth);
    setMonthlyStates(prev => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        monthKey,
        backdrop: prev[monthKey]?.backdrop || '',
        stickers: prev[monthKey]?.stickers || [],
        customStickerBank: (prev[monthKey]?.customStickerBank || []).filter(s => s.id !== id),
      },
    }));
  }, [currentMonth]);
  
  // Content CRUD
  const addContentItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...item,
      id: `content-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setContentItems(prev => [...prev, newItem]);
  };
  
  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };
  
  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Event CRUD
  const addEvent = (event: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEvent: EventItem = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setEvents(prev => [...prev, newEvent]);
  };
  
  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };
  
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };
  
  // Event Requests
  const addEventRequest = (request: Omit<EventRequest, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newRequest: EventRequest = {
      ...request,
      id: `request-${Date.now()}`,
      createdAt: now,
    };
    setEventRequests(prev => [...prev, newRequest]);
    
    // Add notification for admin
    const client = clients.find(c => c.id === request.clientId);
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'event_request',
      title: 'בקשה לאירוע חדש',
      message: `${client?.name || 'לקוח'} ביקש אירוע: ${request.title}`,
      eventRequestId: newRequest.id,
      clientId: request.clientId,
      read: false,
      createdAt: now,
    };
    setNotifications(prev => [notification, ...prev]);
  };
  
  const approveEventRequest = (id: string) => {
    const request = eventRequests.find(r => r.id === id);
    if (!request) return;
    
    // Create the event
    addEvent({
      clientId: request.clientId,
      title: request.title,
      description: request.description,
      date: request.date,
      color: 'blue',
    });
    
    // Update request status
    setEventRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'approved' } : r)
    );
  };
  
  const rejectEventRequest = (id: string) => {
    setEventRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
    );
  };
  
  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const value: AppState = {
    currentUser,
    userRole,
    setUserRole,
    selectedClientId,
    setSelectedClientId,
    clients,
    updateClientTheme,
    contentItems,
    events,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    addEvent,
    updateEvent,
    deleteEvent,
    eventRequests,
    addEventRequest,
    approveEventRequest,
    rejectEventRequest,
    filters,
    setFilters,
    calendarView,
    setCalendarView,
    currentMonth,
    setCurrentMonth,
    monthlyStates,
    getCurrentMonthState,
    setMonthlyBackdrop,
    setMonthlyStickers,
    addCustomSticker,
    removeCustomSticker,
    notifications,
    markNotificationRead,
    unreadCount,
    selectedDate,
    setSelectedDate,
    selectedItemId,
    setSelectedItemId,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}