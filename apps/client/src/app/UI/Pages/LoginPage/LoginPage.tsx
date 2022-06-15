import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './LoginPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@planning-poker/react/api-hooks';
import { toast } from 'react-toastify';

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function LoginPage() {
  const { login, userName, profile, isLoggedIn, authToken } = useAuth();
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const g = useGlobalState();
  //const game = useGameHook();
  const navigate = useNavigate();
  const gameHook = useGameHook();
  const state = useLocation().state as LocationState;

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      if (loggedIn === true) {
        if (state?.from) {
          navigate(state.from);
        } else {
          navigate('/');
        }
      }
    });
  }, [authToken]);

  const handleClick = async (username: string, password: string) => {
    try {
      await login
        .mutateAsync(
          { data: { password, username } },
          {
            onError: () => {
              toast.error('Bad login credentials');
            },
          }
        )
        .catch();
    } catch {
      console.log("E")
    }
  };

  return (
    <div className="LoginPage-container">
      <div className="LoginPage-subcontainer">
        <div className="LoginPage-logo-container">
          <div className="LoginPage-image-container">
            <img
              className="LoginPage-image-img"
              src="../../../../assets/poker.png"
              alt="Logo.png"
            ></img>
          </div>
          <div className="LoginPage-text-container">
            <p className="LoginPage-text-txt">Planning Poker</p>
          </div>
        </div>
        <div className="LoginPage-input">
          <p className="LoginPage-loginlabel">Login</p>
          <TextField
            value={username}
            onChange={setUsename}
            placeholder={'username'}
          />
          <TextField
            value={password}
            onChange={setPassword}
            placeholder={'password'}
            type={'password'}
          />
        </div>
        <div className="LoginPage-registercontainer">
          <Link className="LoginPage-register" to="/register">
            Do not have account? Register.
          </Link>
        </div>
        <div className="LoginPage-button">
          <Button
            name="Log in"
            onClick={async () => {
              await handleClick(username, password);
            }}
          />
        </div>
      </div>
    </div>
  );
}
