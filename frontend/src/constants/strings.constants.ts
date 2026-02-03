/**
 * Centralized UI strings for the application
 * All user-facing text should be defined here for easy maintenance and future i18n support
 */

import type { ContentStatus, ContentType } from '@/types/content';
import type { ModalMode } from '@/types/content';

// ============================================================================
// Common / Shared
// ============================================================================

export const COMMON = {
  save: 'שמור שינויים',
  cancel: 'ביטול',
  delete: 'מחק',
  copy: 'העתק',
  apply: 'החל',
  selectDate: 'בחר תאריך',
  notDefined: 'לא הוגדר',
  error: 'שגיאה',
} as const;

// ============================================================================
// App Header
// ============================================================================

export const APP_HEADER = {
  title: 'Content OS',
  requestNewEvent: 'בקשת אירוע חדש',
  logout: 'התנתק',
} as const;

// ============================================================================
// Brand Header
// ============================================================================

export const BRAND_HEADER = {
  title: 'RZ Digital Agency',
} as const;

// ============================================================================
// Role Toggle
// ============================================================================

export const ROLE_TOGGLE = {
  admin: 'מנהל',
  client: 'לקוח',
} as const;

// ============================================================================
// View Toggle
// ============================================================================

export const VIEW_TOGGLE = {
  calendar: 'לוח שנה',
  grid: 'גריד',
} as const;

// ============================================================================
// Client Selector
// ============================================================================

export const CLIENT_SELECTOR = {
  selectClient: 'בחר לקוח',
  drawerTitle: 'בחירת לקוח',
  pendingApprovals: (count: number) => `${count} ממתינים לאישור`,
  contentItems: (count: number) => `${count} פריטי תוכן`,
} as const;

// ============================================================================
// Notifications
// ============================================================================

export const NOTIFICATIONS = {
  title: 'התראות',
  empty: 'אין התראות חדשות',
} as const;

// ============================================================================
// Monthly Theme Editor
// ============================================================================

export const MONTHLY_THEME = {
  label: (monthName: string, year: number) => `נושא חודשי (${monthName} ${year})`,
  placeholder: 'הזן נושא חודשי...',
  editTooltip: 'ערוך נושא חודשי',
  themeLabel: 'נושא חודשי',
} as const;

// ============================================================================
// Backdrop Manager
// ============================================================================

export const BACKDROP = {
  triggerButton: 'רקע חודשי',
  dialogTitle: (monthName: string, year: number) => `בחירת רקע ל${monthName} ${year}`,
  dialogSubtitle: 'הרקע נשמר רק לחודש הנוכחי ולא משפיע על חודשים אחרים',
  uploadTitle: 'העלאת תמונה מותאמת אישית',
  selectFile: 'בחר קובץ',
  pasteUrl: 'או הדבק כתובת תמונה...',
  removeBackdrop: 'הסר רקע',
  presets: {
    minimal: 'מינימלי',
    cream: 'שמנת',
    warm: 'חם',
    botanical: 'בוטני',
    marble: 'שיש',
    linen: 'פשתן',
  },
} as const;

// ============================================================================
// Content Modal
// ============================================================================

export const CONTENT_MODAL = {
  clientMessage: {
    line1: 'השתמש בכפתור "+" בתפריט העליון',
    line2: 'כדי לבקש אירוע חדש',
  },
  save: {
    success: 'נשמר!',
    contentSaved: 'התוכן נשמר בהצלחה',
    eventSaved: 'האירוע נשמר בהצלחה',
    noClientSelected: 'לא נבחר לקוח',
    contentSaveFailed: 'שמירת התוכן נכשלה',
    eventSaveFailed: 'שמירת האירוע נכשלה',
    contentCreateFailed: 'יצירת התוכן נכשלה',
    eventCreateFailed: 'יצירת האירוע נכשלה',
  },
  delete: {
    success: 'נמחק!',
    contentDeleted: 'התוכן נמחק בהצלחה',
    eventDeleted: 'האירוע נמחק בהצלחה',
  },
  copy: {
    success: 'הועתק!',
    captionCopied: 'הקופי הועתק ללוח',
  },
  approve: {
    success: 'אושר!',
    contentApproved: 'התוכן אושר לפרסום',
  },
  reject: {
    success: 'נדחה',
    contentRejected: 'התוכן נדחה והמנהל יקבל התראה',
  },
  file: {
    selected: 'קובץ נבחר',
  },
} as const;

// ============================================================================
// Mode Toggle
// ============================================================================

export const MODE_TOGGLE: Record<ModalMode, string> = {
  media: 'תוכן מדיה',
  event: 'אירוע / הערה',
} as const;

// ============================================================================
// Content Type Selector
// ============================================================================

export const CONTENT_TYPE_SELECTOR: Record<ContentType, string> = {
  post: 'POST',
  story: 'STORY',
  reel: 'REEL',
  carousel: 'CAROUSEL',
} as const;

// ============================================================================
// Status Selector
// ============================================================================

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'טיוטה',
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  rejected: 'נדחה',
  published: 'פורסם',
} as const;

export const STATUS_SELECTOR = {
  label: 'סטטוס',
} as const;

// ============================================================================
// Caption Field
// ============================================================================

export const CAPTION_FIELD = {
  label: 'קופי',
  placeholder: 'כתבו את הקופי כאן...',
  copyButton: 'העתק',
} as const;

// ============================================================================
// Creative Description Field
// ============================================================================

export const CREATIVE_DESCRIPTION_FIELD = {
  label: 'תיאור הקריאייטיב',
  placeholder: 'תיאור פנימי עבור הלקוח (למשל: סרטון אווירה עם מעברים מהירים)',
} as const;

// ============================================================================
// Media Upload
// ============================================================================

export const MEDIA_UPLOAD = {
  replaceFile: 'לחץ להחלפת הקובץ',
  uploadPrompt: 'גרור קובץ או לחץ כאן להעלאה',
} as const;

// ============================================================================
// Content Form
// ============================================================================

export const CONTENT_FORM = {
  approveButton: 'אישור תוכן',
  rejectButton: 'דחיית תוכן',
  rejectionReasonLabel: 'סיבת הדחייה (אופציונלי)',
  rejectionReasonPlaceholder: 'ספר לנו מה לא בסדר...',
  rejectionDialogTitle: 'דחיית התוכן',
  rejectionDialogSubmit: 'שלח דחייה',
  rejectionDialogCancel: 'ביטול',
} as const;

// ============================================================================
// Event Form
// ============================================================================

export const EVENT_FORM = {
  titleLabel: 'כותרת האירוע',
  titlePlaceholder: 'למשל: יום צילום בסטודיו',
  descriptionLabel: 'תיאור / הערות',
  descriptionPlaceholder: 'פרטים נוספים...',
} as const;

// ============================================================================
// Color Picker
// ============================================================================

export const COLOR_PICKER = {
  label: 'צבע מזהה',
} as const;

// ============================================================================
// Sticker Bank
// ============================================================================

export const STICKER_BANK = {
  drawerTitle: 'בנק סטיקרים',
  stickersCount: (count: number) => `${count} סטיקרים`,
} as const;

// ============================================================================
// Custom Sticker Grid
// ============================================================================

export const CUSTOM_STICKER_GRID = {
  title: 'סטיקרים מותאמים',
} as const;

// ============================================================================
// Upload Sticker Dialog
// ============================================================================

export const UPLOAD_STICKER = {
  triggerButton: 'העלה סטיקר מותאם',
  dialogTitle: 'יצירת סטיקר מותאם אישית',
  uploadPrompt: 'לחץ להעלאת תמונה',
  uploadSubtext: 'PNG, JPG, SVG',
  nameLabel: 'שם הסטיקר',
  namePlaceholder: 'למשל: לוגו, פרח מיוחד...',
  saveButton: 'שמור סטיקר',
} as const;

// ============================================================================
// Calendar
// ============================================================================

export const CALENDAR = {
  moreEvents: (count: number) => `+${count} אירועים`,
  addItem: 'הוסף פריט',
} as const;

// ============================================================================
// Filter Bar
// ============================================================================

export const FILTER_BAR = {
  pendingApproval: 'ממתין לאישור',
  posts: 'Post',
  stories: 'Story',
  reels: 'Reel',
  all: 'הכל',
} as const;

// ============================================================================
// Client Event Request Modal
// ============================================================================

export const CLIENT_EVENT_REQUEST = {
  dialogTitle: 'בקשה לאירוע חדש',
  eventNameLabel: 'שם האירוע',
  eventNamePlaceholder: 'למשל: יום צילום, השקת מוצר...',
  dateLabel: 'תאריך מבוקש',
  descriptionLabel: 'תיאור (אופציונלי)',
  descriptionPlaceholder: 'פרטים נוספים על האירוע...',
  submitButton: 'שלח בקשה',
  dateFormat: 'dd בMMMM yyyy',
  validation: {
    error: 'שגיאה',
    requiredFields: 'יש למלא את כל השדות הנדרשים',
  },
  success: {
    title: 'הבקשה נשלחה!',
    description: 'המנהל יקבל התראה על הבקשה שלך',
  },
} as const;

// ============================================================================
// Grid View
// ============================================================================

export const GRID_VIEW = {
  helpText: '',
  emptyMessage: 'אין תוכן מאושר להצגה',
} as const;

// ============================================================================
// Add Image Button
// ============================================================================

export const ADD_IMAGE = {
  button: 'הוסף תמונה',
  dialogTitle: 'הוספת תמונה לגריד',
  selectType: 'בחר סוג תוכן:',
  confirm: 'אישור',
} as const;

// ============================================================================
// Grid Item
// ============================================================================

export const GRID_ITEM = {
  coverBadge: 'קאבר',
} as const;

// ============================================================================
// Grid Item Overlay
// ============================================================================

export const GRID_OVERLAY = {
  replaceCover: 'החלף תמונת קאבר',
  adjustZoomPosition: 'התאם זום ומיקום',
  deleteItem: 'מחק מהגריד',
} as const;

// ============================================================================
// Content Type Labels for Grid
// ============================================================================

export const CONTENT_TYPE_LABELS_HE: Record<ContentType, string> = {
  post: 'פוסט',
  story: 'סטורי',
  reel: 'רילס',
  carousel: 'קרוסלה',
} as const;

// ============================================================================
// Content Badge (Calendar Day Hover Card)
// ============================================================================

export const CONTENT_BADGE = {
  creativeDescriptionLabel: 'תיאור קריאייטיב:',
  captionLabel: 'קופי:',
} as const;

// ============================================================================
// Event Badge
// ============================================================================

export const EVENT_BADGE = {
  descriptionLabel: 'תיאור:',
} as const;

// ============================================================================
// Draggable Sticker
// ============================================================================

export const DRAGGABLE_STICKER = {
  adminTooltip: 'גרור למיקום חדש, לחץ פעמיים למחיקה',
} as const;

// ============================================================================
// Grid Item Media
// ============================================================================

export const GRID_ITEM_MEDIA = {
  noMedia: 'אין מדיה',
} as const;

// ============================================================================
// Login Page
// ============================================================================

export const LOGIN = {
  title: 'Content Creator OS',
  subtitle: 'התחבר לחשבונך',
  emailLabel: 'אימייל',
  emailPlaceholder: 'הכנס אימייל',
  passwordLabel: 'סיסמה',
  passwordPlaceholder: 'הכנס סיסמה',
  loginButton: 'התחבר',
  loggingIn: 'מתחבר...',
  invalidCredentials: 'אימייל או סיסמה שגויים',
  footer: '© 2026 RZ Social Media. כל הזכויות שמורות.',
  validation: {
    emailRequired: 'נא להזין אימייל',
    passwordRequired: 'נא להזין סיסמה',
  },
} as const;

// ============================================================================
// Comments Section
// ============================================================================

export const COMMENTS = {
  title: 'תגובות',
  placeholder: 'כתוב תגובה...',
  send: 'שלח',
  empty: 'אין תגובות עדיין',
  admin: 'מנהל',
  client: 'לקוח',
  deleteConfirm: 'האם למחוק את התגובה?',
  justNow: 'עכשיו',
  minutesAgo: (count: number) => count === 1 ? 'לפני דקה' : `לפני ${count} דקות`,
  hoursAgo: (count: number) => count === 1 ? 'לפני שעה' : `לפני ${count} שעות`,
  daysAgo: (count: number) => count === 1 ? 'אתמול' : `לפני ${count} ימים`,
} as const;

