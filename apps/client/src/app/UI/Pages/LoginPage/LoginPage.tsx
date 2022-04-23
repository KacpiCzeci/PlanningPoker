import React, { useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import './LoginPage.scss';

export default function LoginPage() {
  const [value, setValue] = useState('');
  const g = useGlobalState();
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
        <div
          className="LoginPage-button"
          onClick={() => g.setState((p) => ({ ...p, userName: value }))}
        >
          Button will be here
        </div>
      </div>
    </div>
  );
}
