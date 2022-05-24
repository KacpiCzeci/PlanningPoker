import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './CreateGamePage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function CreateGamePage() {
  const [game, setGame] = useState('');
  const [user, setUser] = useState('');
  const g = useGlobalState();
  //const game = useGameHook();
  const navigate = useNavigate();
  const gameHook = useGameHook();

  const handleClick = () => {
    if(game !== "" && user !== ""){
      g.setState((p) => ({ ...p, gameName: game, userName: user }));
      sessionStorage.setItem('userName', user);
      sessionStorage.setItem('gameName', game);
      let id = generateRoomID();
      sessionStorage.setItem('room', id.toString());
      gameHook.startNewVoting(game);
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

  return (
    <div className="CreateGamePage-container">
        <div className="CreateGamePage-subcontainer">
            <div className="CreateGamePage-logo-container">
                <div className="CreateGamePage-image-container">
                    <img
                        className="CreateGamePage-image-img"
                        src="../../../../assets/poker.png"
                        alt="Logo.png"
                    ></img>
                </div>
                <div className="CreateGamePage-text-container">
                    <p className="CreateGamePage-text-txt">Planning Poker</p>
                </div>
            </div>
            <div className="CreateGamePage-input">
                <TextField
                    value={game}
                    onChange={setGame}
                    placeholder={'Game name'}
                />
                <TextField
                    value={user}
                    onChange={setUser}
                    placeholder={'User name'}
                />
            </div>
            <div className="CreateGamePage-button">
                <Button name="Create Game" onClick={handleClick} />
            </div>
        </div>
    </div>
  );
}