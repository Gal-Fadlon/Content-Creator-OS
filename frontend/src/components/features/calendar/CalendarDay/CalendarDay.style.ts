import { styled } from '@mui/material/styles';
import { Box, Typography, ButtonBase } from '@mui/material';

interface StyledDayCellProps {
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isDragOver?: boolean;
  hasThumbnail?: boolean;
}

export const StyledDayCell = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    !['isCurrentMonth', 'isToday', 'isDragOver', 'hasThumbnail'].includes(prop as string),
})<StyledDayCellProps>(({ theme, isCurrentMonth, isToday, isDragOver, hasThumbnail }) => ({
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
  },
  
  ...(isToday && {
    boxShadow: `0 0 0 2px rgba(0, 35, 102, 0.3)`,
    borderColor: 'rgba(0, 35, 102, 0.5)',
  }),
  
  ...(isDragOver && {
    boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.1)',
  }),

  [theme.breakpoints.down('md')]: {
    minHeight: 90,
  },
}));

export const StyledBackgroundImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl: string }>(({ imageUrl }) => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
  },
}));

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
