import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TextField from '../../Componets/TextField/TextField';
import TextArea from '../../Componets/TextArea/TextArea';
import CardDeck from '../../Componets/CardDeck/CardDeck';
import Button from '../../Componets/Button/Button';
import NavBar from '../../Componets/NavBar/NavBar';
import './GamePage.scss';
import { stringify } from 'querystring';
import {
  GlobalStateInterface,
  useGlobalState,
} from '../../../GlobalStateProvider';
import { useGameHook } from './useGameHook';
import UserList from '../../Componets/UserList/UserList';
import NavItem from '../../Componets/NavItem/NavItem';
import DropdownList from '../../Componets/DropdownList/DropdownList';

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
  const [results, setResults] = useState<Array<number>>([]);
  const [gameState, setGameState] = useState(true);

  const { state, setState } = useGlobalState();
  const [vote, setVote] = useState();
  useEffect(
    () => game.vote(state.cardPicked),
    [state.cardPicked, game.data.players]
  );
  const changeGlobalState = (data: Partial<GlobalStateInterface>) => {
    setState((prevSt) => ({ ...prevSt, ...data }));
  };
  useEffect(() => {
    // console.log("Change name: ",game.data.gameName);
    setGameNameLocal(game.data.gameName ?? '');
  }, [game.data.gameName]);
  const onChange = (e: any) => {
    setState({ resultAverange: e.target.value });
  };

  const CalculateResult = useCallback(() => {
    // console.log("-----------CalculateResult-----------")
    //----Get data---
    let localResultsWithNull: (number | null)[] = [];
    game.data.players.map(({ player, score }) =>
      localResultsWithNull.push(score)
    );
    //----Erase null value---
    localResultsWithNull = localResultsWithNull.filter((s) => s != null);
    const localResults = localResultsWithNull.map((i: any) => {
      return i;
    });
    // console.log("-----results-----");
    console.log(localResultsWithNull);
    // console.log("-----end-----");
    //----calculate result---
    const average =
      localResults.reduce(
        (prevValue, currentValue) => prevValue + currentValue,
        0
      ) / localResults.length;

    const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const goal = Math.round(average);

    const closest = cardsValues.reduce(function (prev, curr) {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    console.log(`Average: ${average}`);
    console.log(`Average in fibo: ${closest}`);

    changeGlobalState({ result: average.toString() });
    changeGlobalState({ resultAverange: closest.toString() });
    return { average, closest };
    // console.log("-----------END-----------")
  }, [game.data.players]);

  const NewBoard = () => {
    changeGlobalState({ result: '0' });
    changeGlobalState({ resultAverange: '0' });
    sessionStorage.setItem('cardPicked', '');
    changeGlobalState({ cardPicked: undefined });
  };
  const HandleNewVote = useCallback(() => {
    game.startNewVoting(gameNameLocal);
  }, [game, gameNameLocal]);
  const results_ = useMemo(() => CalculateResult(), [CalculateResult]);

  return (
    <div className="GamePage-container">
      <div className="GamePage-header">
        <h1>Planning Poker</h1>
        <div>
          <NavBar>
            <NavItem icon="Issue List">
              <DropdownList/>
            </NavItem>
          </NavBar>
        </div>
      </div>
      <div className="GamePage-userinfobar">
        <div className="GamePage-gameusers">Game Users</div>
        <UserList users={game.data.players} />
      </div>
      <div className="GamePage-gameinfo">
        <p>{vote}</p>
        <div className="GamePage-gamename">
          <TextField
            placeholder="Game Name"
            value={gameNameLocal}
            onChange={setGameNameLocal}
            name="Name of vote"
          />
        </div>
        <div className="GamePage-vote">
          <Button
            name="Change name"
            value={0}
            onClick={() => {
              HandleNewVote();
            }}
          />
        </div>

        <div
          className="GamePage-voting-results" 
          //style={{ opacity: state.cardPicked ? undefined : 0 }}
        >
          <TextArea label="Vote Avarege:" value={state.cardPicked ? state.result : ""} />
          <TextArea label="Vote Result:" value={state.cardPicked ? state.resultAverange : ""} />
        </div>
      </div>

      <div className="GamePage-voteinfo">
        <div className="GamePage-voteoptions">
          <CardDeck onChange={(v) => game.vote(v)} />
        </div>
        <div className="GamePage-newvote">
          <Button
            name="New Game"
            value={0}
            onClick={() => {
              NewBoard();
              game.startNewVoting('New voting');
            }}
          />
        </div>
      </div>
    </div>
  );
}
