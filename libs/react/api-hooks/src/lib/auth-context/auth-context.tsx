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
import { useQuery } from 'react-query';

export type AuthContext = {
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  userName: string;
  authToken: string;
  profile?: AuthControllerGetProfileQueryResult;
};

const AuthContext = React.createContext<AuthContext>({
  login: () => 0,
  register: () => 0,
  userName: undefined as any,
  authToken: '',
});

export const AuthProvider: React.FC<object> = ({ children }) => {
  const [authToken, setAuthToken] = useState('');
  const [userName, setUserName] = useState('');

  const getProfile = useQuery(
    'getProfile',
    () => Custom.authControllerGetProfile(authToken),
    { enabled: authToken !== '' }
  );

  return (
    <AuthContext.Provider
      value={{
        authToken,
        login: (username, password) =>
          authControllerLogin({ username, password }).then((res) => {
            setUserName(username);
            return setAuthToken(res.access_token);
          }),
        register: (username, password) =>
          authControllerRegister({ username, password }).then((res) => {
            setUserName(username);
            setAuthToken(res.access_token);
          }),
        userName,
        profile: getProfile.data,
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
