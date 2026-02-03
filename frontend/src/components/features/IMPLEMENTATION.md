# Feature Components

Domain-specific components organized by feature area.

## calendar/

Monthly calendar view for content scheduling.

| Component | Purpose |
|-----------|---------|
| `CalendarView` | Main container with navigation and drag-drop |
| `CalendarGrid` | 7-column grid with Hebrew day headers |
| `CalendarDay` | Day cell with content/event badges |
| `CalendarHeader` | Month/year with prev/next navigation |
| `ContentBadge` | Content type icon with hover popover |
| `EventBadge` | Colored event chip with description |
| `HiddenEventsPopover` | Popover listing overflow events ("+X אירועים") |

## content/

Content and event creation/editing modal components.

| Component | Purpose |
|-----------|---------|
| `ContentModal` | Main dialog for creating/editing |
| `ContentForm` | Form with approve/reject buttons for clients |
| `EventForm` | Event fields: title, description, color |
| `StatusSelector` | Status dropdown (draft/pending/approved/rejected/published) |
| `MultiMediaUpload` | Multi-image upload with drag-drop reordering |
| `CommentsSection` | Threaded comments for content items |
| `CommentItem` | Individual comment with user info and actions |

## grid/

Instagram-style 3-column grid view.

| Component | Purpose |
|-----------|---------|
| `GridView` | Main container with drag-drop reordering |
| `GridItem` | Cell with media, badges, edit controls |
| `GridItemOverlay` | Hover overlay with edit buttons |

## events/

Event request components.

| Component | Purpose |
|-----------|---------|
| `ClientEventRequestModal` | Client form to request events |
| `EventRequestsPanel` | Admin panel to approve/reject requests |

## stickers/

Decorative stickers overlay system.

| Component | Purpose |
|-----------|---------|
| `StickerBank` | Drawer with preset and custom stickers |
| `DraggableSticker` | Positioned sticker on calendar |
| `StickerOverlay` | Transparent drag interaction layer |

## filter/

| Component | Purpose |
|-----------|---------|
| `FilterBar` | Horizontal bar with filter pills |
| `FilterPill` | Toggle for filter options |
