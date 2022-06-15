import React, { useEffect } from 'react';
import checkToken from './CheckToken';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingPage from '../LoadingPage/LoadingPage';
import { useAuth } from '@planning-poker/react/api-hooks';

export interface ReqAth {
  element: JSX.Element;
}

export default function ReqAuthRoute(props: ReqAth): JSX.Element {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let handler: any;
    if (auth.profile?.isLoading) {
      handler = setTimeout(() => navigate('/login'), 4000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [auth.profile?.isLoading]);

  if (auth.authToken === '') {
    return <Navigate to={'/login'} replace state={{ from: location }}/>;
  }

  if (auth.profile?.data?.username !== undefined) {
    return props.element;
  }
  return <LoadingPage />;
}
