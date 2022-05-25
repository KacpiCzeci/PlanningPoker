import { useVotingControllerFinish, useVotingControllerSetCurrentIssue } from '@planning-poker/shared/backend-api-client';
import { SetIssuesBody } from '@planning-poker/shared/backend-api-client';
import { useVotingControllerSetIssues } from '@planning-poker/shared/backend-api-client';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  useVotingControllerVote,
  useVotingControllerGetResult,
  useVotingControllerStartNew,
  calculateEtag,
  GetResultSuccessDto,
} from '@planning-poker/shared/backend-api-client';
import { useGlobalState } from '../../../GlobalStateProvider';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';

export const useGameResult = (onError?: () => void) => {
  const [etag, setEtag] = useState<string>('etag');
  const params = useParams();
  const room = params['id']!;

  const currentResult = useVotingControllerGetResult(
    room,
    { etag },
    { query: { retry: false, queryKey: 'currentResult', onError } }
  );

  function fetch() {
    // calculateEtag?: (
    //   data: Exclude<typeof currentResult.data, undefined>
    // ) => string
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

  return {
    fetch,
    data: currentResult.data,
  };
};

export const useGameHook = () => {
  const g = useGlobalState();
  const params = useParams();
  const room = params['id']!;

  const setIssues = useVotingControllerSetIssues();
  const mutateSetIssues = (x: SetIssuesBody) => {
    return setIssues.mutateAsync({ roomID: room, data: x });
  };

const setActiveIssue = useVotingControllerSetCurrentIssue();
  const mutateSetActiveIssue = (id: string) => {
    return setActiveIssue.mutateAsync({ roomID: room, data: {id} });
  };


  const finishGame = useVotingControllerFinish();
  const mutateFinishGame = () => {
    return finishGame.mutateAsync({ roomID: room });
  };



  const vote = useVotingControllerVote({
    mutation: { onSettled: () => result.fetch() },
  });
  const startNew = useVotingControllerStartNew();
  const startNewVoting = useCallback(
    function startNew_(name: string) {
      return startNew.mutateAsync({ roomID: room, data: { name } });
    },
    [startNew]
  );
  const result = useGameResult(() =>
    startNewVoting(g.state.gameName || 'newVoting')
  );

  const loginToVoting = useCallback(
    function loginToVoting() {
      return vote.mutateAsync({
        roomID: room,
        data: { player: g.state.userName ?? '', score: null },
      });
    },
    [g.state.userName, vote]
  );

  const voteFn = useCallback(
    function voteFNN(value: number | null) {
      console.log('vote', g.state.userName);
      if (g.state.userName) {
        vote.mutateAsync({
          roomID: room,
          data: { player: g.state.userName, score: value ?? null },
        });
      }
    },
    [g.state.userName, vote]
  );
 
  useEffect(function loginToVotingAtStartup() {
    //loginToVoting();
    result.fetch();
  }, []);

  return {
    data:
      result.data ??
      ({
        gameName: '',
        players: [],
        finished: false,
        id: '',
        issues: [],
        tasks: [],
      } as GetResultSuccessDto),
    startNewVoting,
    vote: voteFn,
    setIssues: {...setIssues, mutateAsync: mutateSetIssues},
    setActiveIssue: {...setActiveIssue, mutateAsync: mutateSetActiveIssue},
    finishGame: {...finishGame, mutateAsync: mutateFinishGame}
  };
};
