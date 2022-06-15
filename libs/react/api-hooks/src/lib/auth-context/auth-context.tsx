import {
  authControllerGetProfile,
  AuthControllerGetProfileQueryError,
  AuthControllerGetProfileQueryResult,
  authControllerLogin,
  authControllerRegister,
  useAuthControllerGetProfile,
  Custom,
} from '@planning-poker/shared/backend-api-client';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export type AuthContext = {
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
  userName: string;
  authToken: string;
  profile?: UseQueryResult<AuthControllerGetProfileQueryResult>;
};

const AuthContext = React.createContext<AuthContext>({
  login: () => 0,
  logout: () => 0,
  register: () => 0,
  userName: undefined as any,
  authToken: '',
});

export const AuthProvider: React.FC<{ authToken: string | undefined }> = ({
  children,
  authToken: initAuthToken,
}) => {
  const [authToken, setAuthToken] = useState(initAuthToken ?? '');
  const [userName, setUserName] = useState('');

  var getProfile = useQuery(
    'getProfile',
    () => Custom.authControllerGetProfile(authToken),
    { enabled: authToken !== '', useErrorBoundary: false }
  );

  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        login: (username, password) =>
          authControllerLogin({ username, password }).then( async (res) => {
            setUserName(username);
            sessionStorage.setItem('userName', username);
            sessionStorage.setItem('authToken', res.access_token);
            return setAuthToken(res.access_token);
          }).catch(e => {}),
        logout: () => {
            setUserName('');
            sessionStorage.setItem('userName', '');
            sessionStorage.setItem('authToken', '');
            setAuthToken('');
          },
        register: (username, password) =>
          authControllerRegister({ username, password }).then((res) => {
            setUserName(username);
            sessionStorage.setItem('userName', username);
            sessionStorage.setItem('authToken', res.access_token);
            setAuthToken(res.access_token);
          }).catch(e => {}),
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
