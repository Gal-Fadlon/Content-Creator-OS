/**
 * Login Page
 * Email/password authentication form
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/providers/AuthProvider';
import { LOGIN } from '@/constants/strings.constants';
import {
  StyledLoginPage,
  StyledLoginCard,
  StyledLogo,
  StyledTitle,
  StyledSubtitle,
  StyledForm,
  StyledInputGroup,
  StyledLabel,
  StyledInput,
  StyledButton,
  StyledError,
  StyledFooter,
} from './Login.style';

function Login() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Basic validation
    if (!email.trim()) {
      setLocalError(LOGIN.validation.emailRequired);
      return;
    }
    if (!password) {
      setLocalError(LOGIN.validation.passwordRequired);
      return;
    }

    try {
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      // Error is handled by AuthProvider
      console.error('Login failed:', err);
    }
  };

  const displayError = localError || error;

  return (
    <StyledLoginPage>
      <StyledLoginCard>
        <StyledLogo>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </StyledLogo>
        
        <StyledTitle>{LOGIN.title}</StyledTitle>
        <StyledSubtitle>{LOGIN.subtitle}</StyledSubtitle>

        <StyledForm onSubmit={handleSubmit}>
          <StyledInputGroup>
            <StyledLabel htmlFor="email">{LOGIN.emailLabel}</StyledLabel>
            <StyledInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={LOGIN.emailPlaceholder}
              autoComplete="email"
              autoFocus
              disabled={isLoading}
            />
          </StyledInputGroup>

          <StyledInputGroup>
            <StyledLabel htmlFor="password">{LOGIN.passwordLabel}</StyledLabel>
            <StyledInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={LOGIN.passwordPlaceholder}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </StyledInputGroup>

          {displayError && (
            <StyledError>{displayError}</StyledError>
          )}

          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? LOGIN.loggingIn : LOGIN.loginButton}
          </StyledButton>
        </StyledForm>

        <StyledFooter>{LOGIN.footer}</StyledFooter>
      </StyledLoginCard>
    </StyledLoginPage>
  );
}

export default Login;
