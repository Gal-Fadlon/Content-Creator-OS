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
| `EventBadge` | Colored event/task chip with description (strikethrough for completed tasks) |
| `HiddenEventsPopover` | Popover listing overflow events ("+X אירועים") |

## content/

Content and event creation/editing modal components.

| Component | Purpose |
|-----------|---------|
| `ContentModal` | Main dialog for creating/editing content, events, and tasks |
| `ContentForm` | Form with approve/reject buttons for clients |
| `EventForm` | Event fields: title, description, color |
| `TaskForm` | Task fields: title, description, color, completed checkbox |
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
| `FilterBar` | Horizontal bar with filter pills (content types, pending, tasks) |
| `FilterPill` | Toggle for filter options |

## kanban/

Admin-only Kanban task board with drag-and-drop via `@hello-pangea/dnd`.

| Component | Purpose |
|-----------|---------|
| `KanbanBoard` | `DragDropContext` + horizontal columns container |
| `KanbanColumn` | `Droppable` zone with header, card count, add button |
| `TaskCard` | `Draggable` card with color strip, priority badge, due date |
| `TaskModal` | Create/edit dialog with title, description, status, priority, due date, color label |
| `TaskFilters` | Search input + priority filter pills |
