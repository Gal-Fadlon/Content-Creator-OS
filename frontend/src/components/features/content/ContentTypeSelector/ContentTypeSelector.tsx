import React from 'react';
import type { ContentType } from '@/types/content';
import { CONTENT_TYPE_SELECTOR } from '@/constants/strings.constants';
import {
  StyledTypeSelectorContainer,
  StyledToggleGroup,
  StyledTypeButton,
} from './ContentTypeSelector.style';

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ContentType | null
  ) => {
    if (newType !== null) {
      onTypeChange(newType);
    }
  };

  return (
    <StyledTypeSelectorContainer>
      <StyledToggleGroup
        value={selectedType}
        exclusive
        onChange={handleChange}
      >
        {(['post', 'story', 'reel'] as ContentType[]).map((type) => (
          <StyledTypeButton key={type} value={type}>
            {CONTENT_TYPE_SELECTOR[type]}
          </StyledTypeButton>
        ))}
      </StyledToggleGroup>
    </StyledTypeSelectorContainer>
  );
};

export default React.memo(ContentTypeSelector);
