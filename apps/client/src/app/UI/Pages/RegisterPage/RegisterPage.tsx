import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './RegisterPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const g = useGlobalState();
  //const game = useGameHook();
  const navigate = useNavigate();
  const gameHook = useGameHook();

  const handleClick = async (u: string, p: string) => {
    try {
        const response = await fetch('http://localhost:3333/api/auth/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': u,
                'password': p,
            })
        });
        if (response.ok) {
            const json = await response.json();
            sessionStorage.setItem("token", json.access_token);
            sessionStorage.setItem("login", u);
            navigate("/login");
        }
    } catch(e) {
        console.log(e);
    }
  }

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
                <Button name="Register" onClick={async () => {await handleClick(username, password)}} />
            </div>
        </div>
    </div>
  );
}