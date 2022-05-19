import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './LoginPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [value, setValue] = useState('');
  const g = useGlobalState();
  const game = useGameHook();
  const navigate = useNavigate();

  const handleClick = () => {
    if(value !== ""){
      g.setState((p) => ({ ...p, userName: value }));
      sessionStorage.setItem('userName', value);
      let id = generateRoomID();
      navigate('/' + id);
    }
  }

  function generateRoomID(): String {
    const chars = 'ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890'
    var id = ''
    for(let i=0; i<16; i++){
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  useEffect(() => {
    console.log(generateRoomID());
  }, [])

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
            placeholder={'User name'}
          />
        </div>
        <div className="LoginPage-button">
          <Button name="Enter the Game" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
