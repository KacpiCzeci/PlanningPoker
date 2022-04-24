import { useCallback, useEffect, useState } from 'react';
import {
  useVotingControllerVote,
  useVotingControllerGetResult,
  useVotingControllerStartNew,
  calculateEtag,
} from '@planning-poker/shared/backend-api-client';
import { useGlobalState } from '../../../GlobalStateProvider';
import { useQueryClient } from 'react-query';

export const useGameResult = (onError?: () => void) => {
  const [etag, setEtag] = useState<string>('etag');

  const currentResult = useVotingControllerGetResult(
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

  const vote = useVotingControllerVote({
    mutation: { onSettled: () => result.fetch() },
  });
  const startNew = useVotingControllerStartNew();
  const startNewVoting = useCallback(
    function startNew_(name: string) {
      return startNew.mutateAsync({ data: { name } });
    },
    [startNew]
  );
  const result = useGameResult(() => startNewVoting('newVoting'));

  const loginToVoting = useCallback(
    function loginToVoting() {
      return vote.mutateAsync({
        data: { player: g.state.userName ?? '', score: null },
      });
    },
    [g.state.userName, vote]
  );

  const voteFn = useCallback(
    function voteFNN(value: number|undefined) {
      console.log('vote', value);
      if (g.state.userName) {
        vote.mutateAsync({ data: { player: g.state.userName, score: value??null } });
      }
    },
    [g.state.userName, vote]
  );

  useEffect(function loginToVotingAtStartup() {
    //loginToVoting();
    result.fetch();
  }, []);

  return {
    data: result.data ?? { gameName: undefined, players: [] },
    startNewVoting,
    vote: voteFn,
  };
};
