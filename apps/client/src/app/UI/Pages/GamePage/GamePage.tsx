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
import { useVotingControllerFinish, votingControllerFinish } from 'libs/shared/backend-api-client/src';
import { finished } from 'stream';
import { votingControllerSetIssues } from '@planning-poker/shared/backend-api-client';

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
  const [votessum, setVotessum] = useState(0);
  useEffect(() => {
    game.vote(state.cardPicked ?? null);
    console.log(game.data.players);
  }, [JSON.stringify(state.cardPicked)]);
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
  useEffect(()=>{
    let allvoted=0;
    if(game.data.players !== undefined) {
        for(let i =0;i<game.data.players.length;i++)
        {
            if(game.data.players[i].score!==null)
            allvoted++;
        }
        setVotessum(allvoted);
        console.log(votessum)
    }
  },[game.data.players])
  useEffect(() => {
    
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
        if(average<=89){
          const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
          const goal = Math.round(average);
          const closest = cardsValues.reduce(function (prev, curr) {
            return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
          });
          console.log(`Average: ${average}`);
          console.log(`Average in fibo: ${closest}`);
          changeGlobalState({ result: average.toString() });
          changeGlobalState({ resultAverange: closest.toString() });
        }
    //return { average, closest };
    // console.log("-----------END-----------")
  }, [game.data.finished,game.data.players]);

  const NewBoard = () => {
    changeGlobalState({ result: '0' });
    changeGlobalState({ resultAverange: '0' });
    sessionStorage.setItem('cardPicked', '');
    changeGlobalState({ cardPicked: undefined });
  };
  const HandleNewVote = useCallback(() => {
    game.startNewVoting(gameNameLocal);
  }, [game, gameNameLocal]);
  //const results_ = useMemo(() => CalculateResult(), [CalculateResult]);

  async function copyLinkToClipboard() {
    await navigator.clipboard.writeText(window.location.href);
    console.log(
      (
        document.getElementsByClassName(
          'GamePage-copyinfo'
        ) as HTMLCollectionOf<HTMLElement>
      )[0]
    );
    (
      document.getElementsByClassName(
        'GamePage-copyinfo'
      ) as HTMLCollectionOf<HTMLElement>
    )[0].style.display = 'inline';
    setTimeout(() => {
      (
        document.getElementsByClassName(
          'GamePage-copyinfo'
        ) as HTMLCollectionOf<HTMLElement>
      )[0].style.display = 'none';
    }, 1000);
  }
  const xddd = useVotingControllerFinish();
  useEffect(
    
    ()=>{

      console.log(sessionStorage.getItem('room'))
      if (sessionStorage.getItem('room')!==null){
        console.log("dupa")
        xddd.mutateAsync({roomID:sessionStorage.getItem('room')||""})
      }

    },[state.gameEnded])
  
  function changeGameState(){
    if (state.gameEnded)
   {
     changeGlobalState({ gameEnded: false });
     console.log(game.data.finished)
   }
   else{
     changeGlobalState({ gameEnded: true });
     changeGlobalState({result: undefined, resultAverange: undefined})
     console.log(game.data.finished)
   }
  }
 if(sessionStorage.getItem('master')){
  return (
    <div className="GamePage-container">
      <div className="GamePage-header">
        <img
          className="GamePage-image-img"
          src="../../../../assets/poker.png"
          alt="Logo.png"
        />
        <h1 className="GamePage-h1">Planning Poker</h1>
        <div className="GamePage-navv">
          <NavBar>
            <NavItem icon="Issue List">
              <DropdownList
                issues={game.data.issues.map((i) => ({
                  description: i.tasks[0],
                  storyPoints: (
                    i.players.reduce((a, b) => a + (b.score || 0), 0) /
                    i.players.length
                  ).toString(),
                  title: i.gameName,
                  active: i.current,
                  id: i.id,
                }))}
                onAdd={(issue) =>
                  game.setIssues.mutateAsync({
                    issues: [
                      ...game.data.issues,
                      {
                        current: false,
                        finished: false,
                        gameName: issue.title,
                        id: new Date().toISOString(),
                        players: [],
                        tasks: [issue.description],
                      },
                    ],
                  })
                }
                onSelectActive={(item) =>
                  game.setActiveIssue.mutateAsync(item.id)
                }
              />
            </NavItem>
          </NavBar>
        </div>
      </div>
      <div className="GamePage-userinfobar">
        {/* <div className="GamePage-gameusers">Game Users</div> */}
        <UserList users={game.data.players} />
      </div>
      <div className="GamePage-gameinfo">
        <p>{vote}</p>
        <div className="GamePage-gamename">
          {/* <TextField
            placeholder="Game Name"
            value={gameNameLocal}
            onChange={setGameNameLocal}
            name="Name of vote"
          /> */}
        </div>
        <div className="GamePage-issuename">
          <TextArea
            placeholder="Issue name"
            value={state.selectedIssue}
            onChange={(e) => changeGlobalState({ selectedIssue: e })}
            name="Title of Issue"
          />
        </div>
        <div className="GamePage-vote">
          {/* <Button
            name="Change name"
            value={0}
            onClick={() => {
              HandleNewVote();
            }}
          /> */}
        </div>

        <div
          className="GamePage-voting-results" //style={{ opacity: state.cardPicked ? undefined : 0 }}
        >
          <div className="GamePage-voteavg">
            <p className="GamePage-p">Vote Averange:</p>
            <p className="GamePage-pval">
              {(game.data.finished||game.data.players.length ===votessum) ? state.result : ''}
            </p>
          </div>
          <div className="GamePage-voterlt">
            <p className="GamePage-p">Vote Result:</p>
            <p className="GamePage-pval">
              {(game.data.finished||game.data.players.length===votessum) ? state.resultAverange : ''}
            </p>
          </div>
          {/* <TextArea label="Vote Avarege:" value={state.cardPicked ? state.result : ""} /> */}
          {/* <TextArea label="Vote Result:" value={state.cardPicked ? state.resultAverange : ""} /> */}
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
          {/* <div className="GamePage-copyinfo-container"> */}
          <span className="GamePage-copyinfo">Link copied!</span>
          {/* </div> */}
          <Button name="Copy link" value={0} onClick={copyLinkToClipboard} />
          <Button name="End/unend game" value={0} onClick={changeGameState} />
        </div>
      </div>
    </div>
  );
 }
 else{
  return (
    <div className="GamePage-container">
      <div className="GamePage-header">
        <img
          className="GamePage-image-img"
          src="../../../../assets/poker.png"
          alt="Logo.png"
        />
        <h1 className="GamePage-h1">Planning Poker</h1>
        <div className="GamePage-navv">
          <NavBar>
            <NavItem icon="Issue List">
            <DropdownList
                issues={game.data.issues.map((i) => ({
                  description: i.tasks[0],
                  storyPoints: (
                    i.players.reduce((a, b) => a + (b.score || 0), 0) /
                    i.players.length
                  ).toString(),
                  title: i.gameName,
                  active: i.current,
                  id: i.id,
                }))}
                onAdd={(issue) =>
                  game.setIssues.mutateAsync({
                    issues: [
                      ...game.data.issues,
                      {
                        current: false,
                        finished: false,
                        gameName: issue.title,
                        id: new Date().toISOString(),
                        players: [],
                        tasks: [issue.description],
                      },
                    ],
                  })
                }
                onSelectActive={(item) =>
                  game.setActiveIssue.mutateAsync(item.id)
                }
              />
            </NavItem>
          </NavBar>
        </div>
      </div>
      <div className="GamePage-userinfobar">
        {/* <div className="GamePage-gameusers">Game Users</div> */}
        <UserList users={game.data.players} />
      </div>
      <div className="GamePage-gameinfo">
        <p>{vote}</p>
        <div className="GamePage-gamename">
          {/* <TextField
            placeholder="Game Name"
            value={gameNameLocal}
            onChange={setGameNameLocal}
            name="Name of vote"
          /> */}
        </div>
        <div className="GamePage-issuename">
          <TextArea
            placeholder="Issue name"
            value={state.selectedIssue}
            onChange={(e)=>changeGlobalState({selectedIssue : e})}
            name="Title of Issue"
          />
        </div>
        <div className="GamePage-vote">
          {/* <Button
            name="Change name"
            value={0}
            onClick={() => {
              HandleNewVote();
            }}
          /> */}
        </div>

        <div
          className="GamePage-voting-results" //style={{ opacity: state.cardPicked ? undefined : 0 }}
        >
          <div className="GamePage-voteavg">
            <p className="GamePage-p">Vote Averange:</p>
            <p className="GamePage-pval">
              {(game.data.finished||game.data.players.length===votessum) ? state.result : ''}
            </p>
          </div>
          <div className="GamePage-voterlt">
            <p className="GamePage-p">Vote Result:</p>
            <p className="GamePage-pval">
              {(game.data.finished||game.data.players.length===votessum) ? state.resultAverange : ''}
            </p>
          </div>
          {/* <TextArea label="Vote Avarege:" value={state.cardPicked ? state.result : ""} /> */}
          {/* <TextArea label="Vote Result:" value={state.cardPicked ? state.resultAverange : ""} /> */}
        </div>
      </div>

      <div className="GamePage-voteinfo">
        <div className="GamePage-voteoptions">
          <CardDeck onChange={(v) => game.vote(v)} />
        </div>
      </div>
    </div>
  );
 }
}