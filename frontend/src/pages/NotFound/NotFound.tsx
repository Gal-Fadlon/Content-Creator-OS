import {
  StyledContainer,
  StyledContent,
  StyledTitle,
  StyledMessage,
  StyledLink,
} from './NotFound.style';

const NotFound = () => {
  return (
    <StyledContainer dir="rtl">
      <StyledContent>
        <StyledTitle variant="h1">404</StyledTitle>
        <StyledMessage>אופס! הדף לא נמצא</StyledMessage>
        <StyledLink href="/">חזרה לדף הבית</StyledLink>
      </StyledContent>
    </StyledContainer>
  );
};

export default NotFound;
