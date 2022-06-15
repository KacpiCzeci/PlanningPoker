import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './RegisterPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@planning-poker/react/api-hooks';
import Checkbox from '../../Componets/CheckBox/CheckBox';
import { toast } from 'react-toastify';

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function RegisterPage() {
  const { register, profile, isLoggedIn, authToken } = useAuth();
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const [policy, setPolicy] = useState(false);
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
    if (policy) {
      try {
        await register.mutateAsync({ data: { username, password } });
      } catch {
        toast.error('Register error', { position: 'bottom-right' });
      }
    } else {
      toast.error('You have to accept the personal data policy', {
        position: 'bottom-right',
      });
    }
  };

  const handleCheckBox = () => {
    setPolicy(!policy);
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
          <p className="RegisterPage-registerlabel">Register</p>
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
        <div className="RegisterPage-checkboxcontainer">
          <Checkbox
            text="Accept the personal data policy."
            handleOnChange={handleCheckBox}
            state={policy}
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
