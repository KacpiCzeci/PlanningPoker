import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './RegisterPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@planning-poker/react/api-hooks';

export default function RegisterPage() {
  const { register, profile } = useAuth();
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const g = useGlobalState();
  //const game = useGameHook();
  const navigate = useNavigate();
  const gameHook = useGameHook();

  useEffect(() => {
    if (profile?.data) {
      navigate('/new');
    }
  }, [profile]);

  const handleClick = async (u: string, p: string) => {
    register(u, p);
  };

  return (
    <div className="RegisterPage-container">
      <div className="RegisterPage-subcontainer">
        <div className="RegisterPage-logo-container">
          <div className="RegisterPage-image-container">
            <img
              className="RegisterPage-image-img"
              src="../../../../assets/poker.png"
              alt="Logo.png"
            ></img>
          </div>
          <div className="RegisterPage-text-container">
            <p className="RegisterPage-text-txt">Planning Poker</p>
          </div>
        </div>
        <div className="RegisterPage-input">
          <TextField
            value={username}
            onChange={setUsename}
            placeholder={'username'}
          />
          <TextField
            value={password}
            onChange={setPassword}
            placeholder={'password'}
          />
        </div>
        <div className="RegisterPage-button">
          <Button
            name="Register"
            onClick={async () => {
              await handleClick(username, password);
            }}
          />
        </div>
      </div>
    </div>
  );
}
