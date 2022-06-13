import React from "react";
import { useState, useEffect } from "react";
import GamePage from "../GamePage/GamePage";
import { Navigate, useParams } from "react-router-dom";
import LoginPage from "../LoginPage1/LoginPage";
import LoadingPage from '../LoadingPage/LoadingPage';
import { useGlobalState } from "../../../GlobalStateProvider";

export default function CheckPage() {
    const [loading, setLoading] = useState(true);
    const [isGameOk, setIsGameOk] = useState(false);
    const [userInGame, setUserInGame] = useState(false);
    const globalstate = useGlobalState();

    const params = useParams();

    const checkGame = () => {
        console.log(params.id);
        return true;
    }

    useEffect(() => {
        async function fetchData() {
            const game = checkGame();
            const user = globalstate.state.userName? true: false;//await (sessionStorage.getItem('userName'))? true: false;
            console.log(sessionStorage.getItem('userName'));

            setIsGameOk(game);
            setUserInGame(user);
            setLoading(false);
        }

        fetchData();
    }, [globalstate.state.userName])

    return (isGameOk && userInGame)? <GamePage/>: (isGameOk && !userInGame)? <LoginPage/> : (loading)? <LoadingPage/>  : <Navigate to="/"/>;
}