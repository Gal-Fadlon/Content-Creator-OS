import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, ButtonBase } from '@mui/material';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const StyledSkeletonOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 5,
  borderRadius: 'inherit',
  background: `linear-gradient(
    90deg,
    ${theme.palette.grey[300]} 0%,
    ${theme.palette.grey[200]} 50%,
    ${theme.palette.grey[300]} 100%
  )`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite ease-in-out`,
}));

interface StyledDayCellProps {
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isDragOver?: boolean;
  hasThumbnail?: boolean;
  showEditOnHover?: boolean;
}

export const StyledDayCell = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    !['isCurrentMonth', 'isToday', 'isDragOver', 'hasThumbnail', 'showEditOnHover'].includes(prop as string),
})<StyledDayCellProps>(({ theme, isCurrentMonth, isDragOver, showEditOnHover }) => ({
  minHeight: 110,
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color']),
  textAlign: 'right',
  position: 'relative',
  overflow: 'hidden',
  cursor: isCurrentMonth ? 'pointer' : 'default',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  opacity: isCurrentMonth ? 1 : 0.3,
  pointerEvents: isCurrentMonth ? 'auto' : 'none',
  
  '&:hover': {
    borderColor: isCurrentMonth ? theme.palette.secondary.main : theme.palette.divider,
    // Show edit button on hover when admin with thumbnail
    ...(showEditOnHover && {
      '& .edit-button': {
        opacity: 1,
      },
    }),
  },
  
  ...(isDragOver && {
    boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.1)',
  }),

  [theme.breakpoints.down('md')]: {
    minHeight: 90,
  },
}));

export const StyledBackgroundImageContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  zIndex: 0,
});

interface StyledBackgroundImageProps {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export const StyledBackgroundImage = styled('img', {
  shouldForwardProp: (prop) => !['zoom', 'offsetX', 'offsetY'].includes(prop as string),
})<StyledBackgroundImageProps>(({ zoom, offsetX, offsetY }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
  transition: 'transform 0.2s ease-out',
}));

export const StyledBackgroundOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
  zIndex: 1,
});

export const StyledEditButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.5),
  insetInlineEnd: theme.spacing(0.5),
  width: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 3,
  opacity: 0,
  transition: theme.transitions.create(['transform', 'background-color', 'opacity']),
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: theme.palette.common.white,
  },
}));

export const StyledEditorContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  borderRadius: 'inherit',
  overflow: 'hidden',
});

export const StyledDayContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // In RTL, flex-start = right side
});

interface StyledDayNumberProps {
  isToday?: boolean;
  hasThumbnail?: boolean;
}

export const StyledDayNumber = styled(Typography, {
  shouldForwardProp: (prop) => !['isToday', 'hasThumbnail'].includes(prop as string),
})<StyledDayNumberProps>(({ theme, isToday, hasThumbnail }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  width: 24,
  height: 24,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  
  ...(isToday && {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
  }),
  
  ...(hasThumbnail && !isToday && {
    color: theme.palette.common.white,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }),
  
  ...(!hasThumbnail && !isToday && {
    backgroundColor: 'rgba(247, 245, 240, 0.5)',
  }),
}));

export const StyledContentBadgesContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.5),
  insetInlineStart: theme.spacing(0.5),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start', // In RTL, flex-start = right side
  gap: theme.spacing(0.5),
  maxWidth: '70%',
  zIndex: 2,
}));

export const StyledEventsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.5),
  insetInlineStart: theme.spacing(0.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.25),
  maxWidth: '70%',
  zIndex: 2,
}));

interface StyledMoreTextProps {
  hasThumbnail?: boolean;
}

export const StyledMoreText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hasThumbnail',
})<StyledMoreTextProps>(({ theme, hasThumbnail }) => ({
  fontSize: '0.625rem',
  padding: theme.spacing(0, 0.5),
  color: hasThumbnail ? theme.palette.common.white : theme.palette.text.secondary,
}));
