import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModeToggle from '../ModeToggle/ModeToggle';
import ContentForm from '../ContentForm/ContentForm';
import EventForm from '../EventForm/EventForm';
import CommentsSection from '../CommentsSection/CommentsSection';
import { useContentModal } from './useContentModal';
import { useAuth } from '@/context/providers/AuthProvider';
import { isContentItem, isEventItem } from './ContentModal.helper';
import { CONTENT_MODAL, COMMON } from '@/constants/strings.constants';
import {
  StyledDialog,
  StyledDialogContent,
  StyledHiddenInput,
  StyledClientMessage,
  StyledClientMessageText,
  StyledSaveButton,
} from './ContentModal.style';

const ContentModal: React.FC = () => {
  const { user } = useAuth();
  const {
    isOpen,
    isEditing,
    isAdmin,
    isUploading,
    item,
    mode,
    displayDate,
    fileInputRef,
    contentType,
    status,
    caption,
    creativeDescription,
    mediaPreview,
    eventTitle,
    eventDescription,
    eventColor,
    setMode,
    setContentType,
    setStatus,
    setCaption,
    setCreativeDescription,
    setEventTitle,
    setEventDescription,
    setEventColor,
    handleClose,
    handleDelete,
    handleApprove,
    handleReject,
    handleFileClick,
    handleFileChange,
    handleFileDrop,
    handleSave,
    formatDate,
  } = useContentModal();

  const showContentForm = mode === 'media' || (isEditing && item && isContentItem(item));
  const showEventForm = mode === 'event' || (isEditing && item && isEventItem(item));
  const contentItem = item && isContentItem(item) ? item : null;
  const showComments = isEditing && contentItem && user;

  return (
    <StyledDialog open={isOpen} onClose={handleClose} disableRestoreFocus>
      {/* Hidden file input */}
      <StyledHiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      <ModalHeader
        dateDisplay={formatDate(displayDate)}
        isAdmin={isAdmin}
        isEditing={isEditing}
        onClose={handleClose}
        onDelete={handleDelete}
      />

      <StyledDialogContent>
        {/* Mode toggle - only for new items */}
        {!isEditing && isAdmin && (
          <ModeToggle mode={mode} onModeChange={setMode} />
        )}

        {/* Content form */}
        {showContentForm && (
          <ContentForm
            item={contentItem}
            isAdmin={isAdmin}
            isEditing={isEditing}
            contentType={contentType}
            status={status}
            caption={caption}
            creativeDescription={creativeDescription}
            mediaPreview={mediaPreview}
            onContentTypeChange={setContentType}
            onStatusChange={setStatus}
            onCaptionChange={setCaption}
            onCreativeDescriptionChange={setCreativeDescription}
            onFileClick={handleFileClick}
            onFileDrop={handleFileDrop}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {/* Comments section - only for existing content items */}
        {showComments && (
          <CommentsSection
            contentId={contentItem.id}
            currentUserId={user.id}
          />
        )}

        {/* Event form */}
        {showEventForm && (
          <EventForm
            eventTitle={eventTitle}
            eventDescription={eventDescription}
            eventColor={eventColor}
            isAdmin={isAdmin}
            onTitleChange={setEventTitle}
            onDescriptionChange={setEventDescription}
            onColorChange={setEventColor}
          />
        )}

        {/* Save button (admin only) */}
        {isAdmin && (
          <StyledSaveButton 
            onClick={handleSave} 
            variant="contained" 
            size="large"
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : COMMON.save}
          </StyledSaveButton>
        )}

        {/* Info for client when viewing new date */}
        {!isAdmin && !isEditing && (
          <StyledClientMessage>
            <StyledClientMessageText>{CONTENT_MODAL.clientMessage.line1}</StyledClientMessageText>
            <StyledClientMessageText variant="body2">
              {CONTENT_MODAL.clientMessage.line2}
            </StyledClientMessageText>
          </StyledClientMessage>
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default React.memo(ContentModal);
