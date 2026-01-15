import React from 'react';
import { BRAND_HEADER } from '@/constants/strings.constants';
import {
  StyledBrandHeaderContainer,
  StyledBrandTitle,
} from './BrandHeader.style';

const BrandHeader: React.FC = () => {
  return (
    <StyledBrandHeaderContainer component="div">
      <StyledBrandTitle variant="h1">
        {BRAND_HEADER.title}
      </StyledBrandTitle>
    </StyledBrandHeaderContainer>
  );
};

export default React.memo(BrandHeader);
