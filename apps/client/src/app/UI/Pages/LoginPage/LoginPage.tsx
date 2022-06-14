import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../GlobalStateProvider';
import TextField from '../../Componets/TextField/TextField';
import Button from '../../Componets/Button/Button';
import './LoginPage.scss';
import { useGameHook } from '../GamePage/useGameHook';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsename] = useState('');
  const [password, setPassword] = useState('');
  const g = useGlobalState();
  //const game = useGameHook();
  const navigate = useNavigate();
  const gameHook = useGameHook();

  const handleClick = async (u: string, p: string) => {
    try {
        const response = await fetch('http://localhost:3333/api/auth/login', {
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
            console.log(json.access_token);
            sessionStorage.setItem("token", json.access_token);
            sessionStorage.setItem("login", u);
            navigate("/new");
        }
    } catch(e) {
        console.log(e);
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
            <div>
                <Link to="/register">Do not have account? Register.</Link>
            </div>
            <div className="LoginPage-button">
                <Button name="Log in" onClick={async () => {await handleClick(username, password)}} />
            </div>
        </div>
    </div>
  );
}