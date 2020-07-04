import React from 'react';
import {
  Auth0Provider,
  useAuth0,
  RedirectLoginOptions,
  LogoutOptions,
} from '@auth0/auth0-react';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | undefined;
  user: any;
  loginWithRedirect: (
    options?: RedirectLoginOptions | undefined,
  ) => Promise<void>;
  logout: (options?: LogoutOptions | undefined) => void;
}

const AuthContext = React.createContext<AuthState | undefined>(undefined);
type AuthProviderProps = { children: React.ReactNode };

function AuthProvider({ children }: AuthProviderProps) {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  if (!process.env.REACT_APP_AUTH0_DOMAIN) {
    throw new Error('REACT_APP_AUTH0_DOMAIN must be set');
  }

  if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
    throw new Error('REACT_APP_AUTH0_CLIENT_ID must be set');
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
      }}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}>
        {children}
      </Auth0Provider>
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
