# Feature Components

Domain-specific components organized by feature area.

## calendar/

Monthly calendar view for content scheduling.

| Component | Purpose |
|-----------|---------|
| `CalendarView` | Main calendar container with navigation and drag-drop logic |
| `CalendarGrid` | 7-column grid layout rendering days with Hebrew headers |
| `CalendarDay` | Individual day cell with content/event badges and thumbnails |
| `CalendarHeader` | Month/year display with prev/next navigation |
| `ContentBadge` | Content type icon badge with hover popover details |
| `EventBadge` | Colored event chip with hover description |

**Features:** Drag-drop rescheduling (admin), click-to-edit, thumbnail backgrounds

---

## content/

Content and event creation/editing modal components.

| Component | Purpose |
|-----------|---------|
| `ContentModal` | Main dialog for creating/editing content and events |
| `ContentForm` | Form fields for content: type, status, media, caption |
| `EventForm` | Form fields for events: title, description, color |
| `ContentTypeSelector` | Toggle group for post/story/reel selection |
| `StatusSelector` | Dropdown for content status (pending/approved/etc) |
| `MediaUpload` | Image/video upload area with preview |
| `CaptionField` | Multiline text field with copy button |
| `CreativeDescriptionField` | Description textarea (admin editable, client readonly) |
| `ColorPicker` | Color selection for event markers |
| `ModeToggle` | Switch between media and event creation modes |
| `ModalHeader` | Dialog header with date display and delete action |

**Features:** Role-based editing (admin vs client), file uploads, client approval flow

---

## grid/

Instagram-style 3-column grid view for content display.

| Component | Purpose |
|-----------|---------|
| `GridView` | Main grid container with drag-drop reordering |
| `GridItem` | Individual grid cell with media, badges, edit controls |
| `GridItemMedia` | Image/video display with zoom and offset transforms |
| `GridItemOverlay` | Hover overlay with edit/cover buttons (admin) |
| `GridItemEditControls` | Zoom slider and pan controls for image cropping |
| `ContentTypeBadge` | Small badge indicating post/story/reel type |
| `AddImageButton` | "+" button for adding new content |
| `AddImageDialog` | Dialog for confirming new image uploads |
| `InlineImageEditor` | Inline image positioning editor |

**Features:** Drag-drop reorder, inline cover image editing, zoom/pan controls

---

## stickers/

Decorative stickers overlay system for calendar.

| Component | Purpose |
|-----------|---------|
| `StickerBank` | Expandable drawer with preset and custom stickers |
| `StickerGrid` | Grid of preset sticker options |
| `CustomStickerGrid` | User-uploaded custom stickers with remove option |
| `DraggableSticker` | Positioned sticker element on calendar overlay |
| `StickerOverlay` | Transparent layer for sticker drag interactions |
| `UploadStickerDialog` | Dialog for uploading custom stickers with labels |

**Features:** Preset stickers, custom uploads, drag positioning, double-click removal

---

## events/

Client-facing event request components.

| Component | Purpose |
|-----------|---------|
| `ClientEventRequestModal` | Form for clients to request new calendar events |

**Features:** Date picker, validation, async submission with toast feedback

---

## filter/

Content filtering controls.

| Component | Purpose |
|-----------|---------|
| `FilterBar` | Horizontal bar with filter pills |
| `FilterPill` | Toggle button for filter options (type, pending) |

**Features:** Filter by content type (post/story/reel), pending approval filter
