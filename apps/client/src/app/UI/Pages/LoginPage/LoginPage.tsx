import React, { useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './LoginPage.scss';
import { useGameHook } from '../GamePage/useGameHook';

export default function LoginPage() {
  const [value, setValue] = useState('');
  const g = useGlobalState();
  const game = useGameHook();

  const handleClick = () => {
    if(value !== ""){
      g.setState((p) => ({ ...p, userName: value }));
      sessionStorage.setItem('userName', value);
    }
  }

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
          <TextField
            value={value}
            onChange={setValue}
            placeholder={'User1'}
            destiny="name-of-vote"
          />
        </div>
        <div className="LoginPage-button">
          <Button name="Enter the Game" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
