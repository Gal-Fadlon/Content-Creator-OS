import React from 'react';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ADD_IMAGE } from '@/constants/strings.constants';
import { StyledAddButton } from './AddImageButton.style';

interface AddImageButtonProps {
  onClick: () => void;
}

const AddImageButton: React.FC<AddImageButtonProps> = ({ onClick }) => {
  return (
    <StyledAddButton onClick={onClick}>
      <AddIcon />
      <Typography variant="caption" component="span">
        {ADD_IMAGE.button}
      </Typography>
    </StyledAddButton>
  );
};

export default React.memo(AddImageButton);
