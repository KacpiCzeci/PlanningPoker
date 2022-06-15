import {
  AuthControllerGetProfileQueryResult,
  Custom,
  useAuthControllerLogin,
  useAuthControllerRegister,
  JwtDTO,
  LoginDto,
} from '@planning-poker/shared/backend-api-client';
import React, { useContext, useState } from 'react';
import { UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export type AuthContext = {
  login: UseMutationResult<
    JwtDTO,
    unknown,
    {
      data: LoginDto;
    },
    unknown
  >;
  logout: () => void;
  register: UseMutationResult<
    JwtDTO,
    unknown,
    {
      data: LoginDto;
    },
    unknown
  >;
  userName: string;
  authToken: string;
  profile?: UseQueryResult<AuthControllerGetProfileQueryResult>;
  isLoggedIn: () => Promise<boolean>;
};

const AuthContext = React.createContext<AuthContext>({
  login: undefined as never,
  logout: undefined as never,
  register: undefined as never,
  userName: undefined as never,
  authToken: '',
  isLoggedIn: undefined as never,
});

export const AuthProvider: React.FC<{ authToken: string | undefined }> = ({
  children,
  authToken: initAuthToken,
}) => {
  const [authToken, setAuthToken] = useState(initAuthToken ?? '');
  const [userName, setUserName] = useState('');

  const getProfile = useQuery(
    'getProfile',
    () => Custom.authControllerGetProfile(authToken),
    { enabled: authToken !== '', useErrorBoundary: false }
  );

  const login = useAuthControllerLogin({
    mutation: {
      onSuccess: ({ access_token }, { data: { username } }) => {
        setUserName(username);
        sessionStorage.setItem('authToken', access_token);
        setAuthToken(access_token);
        setUserName(username);
      },
      useErrorBoundary: false,
    },
  });

  const register = useAuthControllerRegister({
    mutation: {
      onSuccess: ({ access_token }, { data: { username } }) => {
        setUserName(username);
        sessionStorage.setItem('authToken', access_token);
        setAuthToken(access_token);
        setUserName(username);
      },
      useErrorBoundary: false,
    },
  });

  const logout = () => {
    setUserName('');
    setAuthToken('');
    sessionStorage.setItem('authToken', '');
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: async () => {
          try {
            const data = await Custom.authControllerGetProfile(authToken);
            if (data.userId !== undefined) {
              return true;
            }
            logout();
            return false;
          } catch {
            logout();
            return false;
          }
        },
        authToken,
        login,
        logout,
        register,
        userName,
        profile: getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => {
  const data = useContext(AuthContext);
  if (data.userName === undefined) {
    throw 'You need to use AuthProvider wrapper!!!';
  }
  return data;
};
