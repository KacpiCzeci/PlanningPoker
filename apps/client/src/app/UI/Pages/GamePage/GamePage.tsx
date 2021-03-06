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
  useEffect(() => {
    let allvoted = 0;
    if (game.data.players !== undefined) {
      for (let i = 0; i < game.data.players.length; i++) {
        if (game.data.players[i].score !== null) allvoted++;
      }
      setVotessum(allvoted);
      console.log(votessum);
    }
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

  function changeGameState() {
    if (state.gameEnded) {
      changeGlobalState({ gameEnded: false });
      console.log(game.data.finished);
    } else {
      changeGlobalState({ gameEnded: true });
      changeGlobalState({ result: undefined, resultAverange: undefined });
      console.log(game.data.finished);
    }
  }
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
                  storyPoints: i.storyPoints ? i.storyPoints.toString() : '-',
                  title: i.gameName,
                  active: i.current,
                  id: i.id,
                }))}
                onUpdate={(issue) => {
                  const newIssues = [...game.data.issues];
                  const issueToChange = newIssues.find(
                    (i) => i.id === issue.id
                  );
                  if (issueToChange) {
                    issueToChange.gameName = issue.title;
                    issueToChange.tasks[0] = issue.description;
                    game.setIssues.mutateAsync({ issues: newIssues });
                  }
                }}
                onAdd={(issue) =>
                  game.setIssues.mutateAsync({
                    issues: [
                      ...game.data.issues,
                      {
                        storyPoints: null,
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
                onAddMany={(issuess) => {
                  game.setIssues.mutateAsync({
                    issues: [
                      ...issuess.map((x) => ({
                        ...x,
                        id: `${new Date().toString()}`+Math.random(),
                      })),
                    ],
                  });
                }}
                onRemove={(index) => {
                  game.setIssues.mutateAsync({
                    issues: [
                      ...game.data.issues.slice(0, index),
                      ...game.data.issues.slice(
                        index + 1,
                        game.data.issues.length
                      ),
                    ],
                    // ...issuesSessionStorage.slice(0, i),
                    // ...issuesSessionStorage.slice(i + 1, issuesSessionStorage.length),
                  });
                }}
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
            value={game.data.gameName}
            onChange={(e) => {
              return;
            }}
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
              {game.data.finished ||
              (game.data.players.length > 0 &&
                game.data.players.every((x) => x.score != undefined))
                ? game.data.calculatedStoryPoints[0]
                : ''}
            </p>
          </div>
          <div className="GamePage-voterlt">
            <p className="GamePage-p">Vote Result:</p>
            <p className="GamePage-pval">
              {game.data.finished ||
              (game.data.players.length > 0 &&
                game.data.players.every((x) => x.score != undefined))
                ? game.data.calculatedStoryPoints[1]
                : ''}
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
        {game.amIHost ? (
          <div className="GamePage-newvote">
            {/* <div className="GamePage-copyinfo-container"> */}
            <span className="GamePage-copyinfo">Link copied!</span>
            {/* </div> */}
            <Button name="Copy link" value={0} onClick={copyLinkToClipboard} />
            <Button
              name="End/unend game"
              value={0}
              onClick={() => {
                if (game.data.finished) {
                  game.resumeGame.mutateAsync();
                } else {
                  game.finishGame.mutateAsync();
                }
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
