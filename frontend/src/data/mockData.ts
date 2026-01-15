import { Client, ContentItem, EventItem, Notification, User } from '@/types/content';

// Demo users
export const mockUsers: User[] = [
  { id: 'admin-1', name: 'שרון - מנהל סושיאל', role: 'admin' },
  { id: 'client-1', name: 'דני כהן', role: 'client', clientId: 'c1' },
  { id: 'client-2', name: 'מיכל לוי', role: 'client', clientId: 'c2' },
];

// Demo clients
export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'קפה נמרוד',
    avatarUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
    monthlyTheme: 'CORE - ניהול ואסטרטגיית תוכן',
    description: 'בית קפה בוטיק בתל אביב',
    pendingApprovals: 3,
    totalContent: 12,
  },
  {
    id: 'c2',
    name: 'סטודיו יוגה זן',
    avatarUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=100&h=100&fit=crop',
    monthlyTheme: 'חודש הרוגע - טיפים ושגרות',
    description: 'סטודיו יוגה ומדיטציה',
    pendingApprovals: 1,
    totalContent: 8,
  },
  {
    id: 'c3',
    name: 'אופנת שמש',
    avatarUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    monthlyTheme: 'קולקציית קיץ 2026',
    description: 'חנות אופנה מקומית',
    pendingApprovals: 5,
    totalContent: 20,
  },
];

// Demo content items
export const mockContentItems: ContentItem[] = [
  // Client 1 - קפה נמרוד
  {
    id: 'content-1',
    clientId: 'c1',
    type: 'reel',
    status: 'approved',
    platform: 'instagram',
    date: '2026-01-13',
    time: '10:00',
    caption: '☕ בוקר טוב מקפה נמרוד! היום אנחנו משיקים את השייק החדש שלנו - מנגו וציה 🥭✨\n\nבואו לטעום ותגידו לנו מה אתם חושבים! 👇\n\n#קפה #תלאביב #שייק #מנגו',
    mediaUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200',
    notes: 'לתייג את המוזיקה: Chill Morning Vibes',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-12T14:30:00Z',
  },
  {
    id: 'content-2',
    clientId: 'c1',
    type: 'reel',
    status: 'pending',
    platform: 'instagram',
    date: '2026-01-15',
    time: '18:00',
    caption: '🎬 מאחורי הקלעים של הבריסטה שלנו!\n\nצפו איך יוסי מכין את הלאטה ארט המושלם ☕🎨\n\n#לאטהארט #בריסטה #קפה #אמנות',
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z',
  },
  {
    id: 'content-3',
    clientId: 'c1',
    type: 'reel',
    status: 'pending',
    platform: 'instagram',
    date: '2026-01-17',
    time: '12:00',
    caption: '🥐 קרואסונים טריים מהתנור!\n\nכל יום ב-7 בבוקר יוצאת מנה חדשה 🔥\n\n#מאפים #קרואסון #בוקר #טרי',
    mediaUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200',
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'content-4',
    clientId: 'c1',
    type: 'post',
    status: 'draft',
    platform: 'instagram',
    date: '2026-01-19',
    time: '14:00',
    caption: '📍 מיקום חדש!\n\nאנחנו שמחים להודיע על פתיחת הסניף החדש שלנו ברמת גן 🎉\n\nכתובת: רחוב ביאליק 42\nשעות פתיחה: 7:00-22:00\n\n#סניףחדש #רמתגן #קפה',
    mediaUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    mediaType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200',
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-01-08T11:00:00Z',
  },
  {
    id: 'content-5',
    clientId: 'c1',
    type: 'story',
    status: 'approved',
    platform: 'instagram',
    date: '2026-01-14',
    time: '09:00',
    caption: 'בוקר טוב! ☀️ מי רוצה קפה?',
    mediaUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    mediaType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
    createdAt: '2026-01-13T08:00:00Z',
    updatedAt: '2026-01-13T08:00:00Z',
  },
  // Client 2 - סטודיו יוגה זן
  {
    id: 'content-6',
    clientId: 'c2',
    type: 'reel',
    status: 'pending',
    platform: 'instagram',
    date: '2026-01-16',
    time: '07:00',
    caption: '🧘‍♀️ שגרת בוקר ב-5 דקות\n\nתרגילים פשוטים שיתחילו לכם את היום בצורה הטובה ביותר 💫\n\n#יוגה #בוקר #מדיטציה #רוגע',
    mediaUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200',
    createdAt: '2026-01-10T06:00:00Z',
    updatedAt: '2026-01-10T06:00:00Z',
  },
  // Client 3 - אופנת שמש
  {
    id: 'content-7',
    clientId: 'c3',
    type: 'reel',
    status: 'approved',
    platform: 'instagram',
    date: '2026-01-13',
    time: '16:00',
    caption: '👗 New Arrivals!\n\nהקולקציה החדשה שלנו הגיעה לחנות 🌸\n\n#אופנה #קולקציהחדשה #קיץ2026 #סטייל',
    mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    createdAt: '2026-01-09T14:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z',
  },
];

// Demo events
export const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    clientId: 'c1',
    title: 'יום צילום בסטודיו',
    description: 'צילום מוצרים חדשים לקולקציית הקיץ',
    date: '2026-01-20',
    color: 'blue',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'event-2',
    clientId: 'c1',
    title: 'השקת מוצר חדש',
    description: 'השקת השייק הטרופי החדש',
    date: '2026-01-25',
    color: 'red',
    createdAt: '2026-01-06T11:00:00Z',
    updatedAt: '2026-01-06T11:00:00Z',
  },
  {
    id: 'event-3',
    clientId: 'c2',
    title: 'סדנת יוגה מיוחדת',
    description: 'סדנה עם מדריך אורח',
    date: '2026-01-22',
    color: 'beige',
    createdAt: '2026-01-07T09:00:00Z',
    updatedAt: '2026-01-07T09:00:00Z',
  },
];

// Demo notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'content_pending',
    title: 'תוכן חדש לאישור',
    message: 'רילס חדש מחכה לאישורך - קפה נמרוד',
    contentId: 'content-2',
    clientId: 'c1',
    read: false,
    createdAt: '2026-01-13T08:00:00Z',
  },
  {
    id: 'notif-2',
    type: 'publish_reminder',
    title: 'תזכורת פרסום',
    message: 'בעוד 5 דקות: רילס של קפה נמרוד',
    contentId: 'content-1',
    clientId: 'c1',
    read: false,
    createdAt: '2026-01-13T09:55:00Z',
  },
  {
    id: 'notif-3',
    type: 'content_approved',
    title: 'תוכן אושר!',
    message: 'הלקוח אישר את הרילס',
    contentId: 'content-1',
    clientId: 'c1',
    read: true,
    createdAt: '2026-01-12T14:30:00Z',
  },
];

// Helper to get content for a specific client
export function getClientContent(clientId: string): ContentItem[] {
  return mockContentItems.filter(item => item.clientId === clientId);
}

// Helper to get events for a specific client
export function getClientEvents(clientId: string): EventItem[] {
  return mockEvents.filter(event => event.clientId === clientId);
}

// Helper to get pending approvals count
export function getPendingApprovals(clientId: string): number {
  return mockContentItems.filter(
    item => item.clientId === clientId && item.status === 'pending'
  ).length;
}
