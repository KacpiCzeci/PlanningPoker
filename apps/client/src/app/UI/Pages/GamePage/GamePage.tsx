import React, { useState, useEffect } from 'react';
import TextField from '../../Componets/TextField/TextField';
import TextArea from '../../Componets/TextArea/TextArea';
import CardDeck from '../../Componets/CardDeck/CardDeck';
import Button from '../../Componets/Button/Button';
import './GamePage.scss';
import { stringify } from 'querystring';
import {
  GlobalStateInterface,
  useGlobalState,
} from '../../../GlobalStateProvider';
import { useGameHook } from './useGameHook';

function getSessionStorageOrDefault(key: string, defaultValue: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return stored;
}

export default function GamePage() {
  const game = useGameHook();

  const [gameNameLocal, setGameNameLocal] = useState('');
  const [results, setResults] = useState([]);
  const [gameState, setGameState] = useState(true);

  const { state, setState } = useGlobalState();
  const [vote, setVote] = useState();

  const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
    setState((prevSt) => ({ ...prevSt, ...data }));
  };

  const onChange = (e: any) => {
    setState({ resultAverange: e.target.value });
  };
  /**
   * Send singal end game to backend
   * then calculate result
   */
  const Vote = async () => {
    await fetch('http://localhost:3000/Vote', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('GET: ' + res.gameState);
        setVote(res.gameState);
      })
      .then((res) => CalculateResult())
      .catch((error) =>
        console.log('Error: Vote fetch http://localhost:3000/Endgame', error)
      );
  };
  /**
   * Calculate the results
   *
   */
  const CalculateResult = () => {
    const average =
      results.reduce((prevValue, currentValue) => prevValue + currentValue, 0) /
      results.length;

    const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const goal = Math.round(average);

    const closest = cardsValues.reduce(function (prev, curr) {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    console.log(`Average: ${average}`);
    console.log(`Average in fibo: ${closest}`);
    changeGlobalState({ result: average.toString() });
    changeGlobalState({ resultAverange: closest.toString() });
  };

  useEffect(() => {
    async function GetResult(url: string) {
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          /** Game Name */
          setGameNameLocal(res.slice(0)[0].gameName);
          console.log(`gameNameLocal: ${gameNameLocal}`);
          changeGlobalState({ gameName: gameNameLocal });
          console.log(`gameName: ${state.gameName}`);

          /**Players&Score */
          setResults(
            res.slice(1, 2)[0].players.map((i: any) => {
              return i.score;
            })
          );
          console.log('Results: ' + results);

          /**Game State */
          setGameState(res.slice(-1)[0].gameState);
          console.log(gameState);
        })
        .catch((error) =>
          console.log(
            'Error: GetResults fetch http://localhost:3000/GetResult',
            error
          )
        );
    }
    GetResult('http://localhost:3000/GetResults');
  }, []);
  return (
    <div className="GamePage-container">
      <div className="GamePage-header">
        <h1>Planning Poker</h1>
        {state.gameName}
      </div>
      <div className="GamePage-userinfobar">
        <div className="GamePage-gameusers">Game Users</div>
        {game.data.players.map(({ player, score }) => (
          <div className="GamePage-username">
            {player} - {score}
          </div>
        ))}
      </div>
      <div className="GamePage-gameinfo">
        <p>{vote}</p>
        <div className="GamePage-gamename">
          <TextField
            value={gameNameLocal}
            onChange={setGameNameLocal}
            name="Name of vote"
            destiny="name-of-vote"
          />
        </div>
        <div className="GamePage-vote">
          <Button name="Vote" value={0} onClick={Vote} />
        </div>
        <div className="GamePage-voting-results">
          <TextArea label="Avr1:" value={state.result} />
          <TextArea label="Avr2:" value={state.resultAverange} />
        </div>
      </div>

      <div className="GamePage-voteinfo">
        <div className="GamePage-voteoptions">
          <CardDeck onChange={(v) => game.vote(v)} />
        </div>
        <div className="GamePage-newvote">
          <Button value={0} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
