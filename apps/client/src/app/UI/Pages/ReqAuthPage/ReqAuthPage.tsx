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
    navigate('/login');
    return <Navigate to={'/login'} />;
  }

  if (auth.profile?.data?.username) {
    return props.element;
  }
  return <LoadingPage />;
}
