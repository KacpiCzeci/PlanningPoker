import {
  GetResultSuccessDto,
  useVotingControllerGetResult,
} from '@planning-poker/shared/backend-api-client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export type GameResult = { data: GetResultSuccessDto; fetch: () => void };

const defaultValue: GameResult = {
  fetch: () => 0,
  data: {
    finished: false,
    gameName: '',
    id: '',
    issues: [],
    players: [],
    tasks: [],
  },
};

const GameResultContext = React.createContext<GameResult>(defaultValue);

export const GameProvider: React.FC<object> = ({children}) => {
  const [etag, setEtag] = useState<string>('etag');
  const params = useParams();
  const room = params['id'];

  if (room === undefined) {
    throw 'Cant parse room id from url';
  }

  const currentResult = useVotingControllerGetResult(
    room,
    { etag },
    { query: { retry: false, queryKey: 'currentResult' } }
  );

  function fetch() {
    currentResult.refetch().then(({ data }) => {
      if (data) {
        setEtag(data['etag' as never]);
      }
    });
  }

  useEffect(
    function refetchOnEtagChange() {
      fetch();
    },
    [etag]
  );

  return (
    <GameResultContext.Provider
      value={{
        data: currentResult.data ?? defaultValue.data,
        fetch,
      }}
    >
      {children}
    </GameResultContext.Provider>
  );
};

export const useGameResult = () => {
  return React.useContext(GameResultContext);
};
