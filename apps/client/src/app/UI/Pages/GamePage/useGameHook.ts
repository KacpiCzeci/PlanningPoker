import { useAuth } from '@planning-poker/react/api-hooks';
import {
  Custom,
  PlayerDto,
  useVotingControllerSetCurrentIssue,
} from '@planning-poker/shared/backend-api-client';
import { SetIssuesBody } from '@planning-poker/shared/backend-api-client';
import {
  useVotingControllerSetIssues,
  votingControllerResume,
  votingControllerFinish,
} from '@planning-poker/shared/backend-api-client';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useGameResult } from '@planning-poker/react/api-hooks';

export const useGameHook = () => {
  const { authToken, profile } = useAuth();
  const params = useParams();
  const room = params['id']!;

  const setIssues = useVotingControllerSetIssues();
  const mutateSetIssues = (x: SetIssuesBody) => {
    return setIssues.mutateAsync({ roomID: room, data: x });
  };

  const setActiveIssue = useVotingControllerSetCurrentIssue();
  const mutateSetActiveIssue = (id: string) => {
    return setActiveIssue.mutateAsync({ roomID: room, data: { id } });
  };

  const finishGame = useMutation({
    mutationFn: () => votingControllerFinish(room),
  });

  const resumeGame = useMutation(() => votingControllerResume(room));

  const vote = useMutation({
    mutationFn: (score: number | null) =>
      Custom.votingControllerVote(
        room,
        { player: profile?.data?.username ?? 'unknown' + Math.random(), score },
        authToken
      ),
    onSettled: () => result.fetch(),
  });

  const startNew = useMutation({
    mutationFn: (name: string) =>
      Custom.votingControllerStartNew(room, { name }, authToken),
  });

  const result = useGameResult();

  const voteFn = useCallback(
    function voteFNN(value: number | null) {
      if (profile?.data?.username) {
        vote.mutateAsync(value);
      }
    },
    [profile, vote]
  );

  useEffect(function loginToVotingAtStartup() {
    //loginToVoting();
    result.fetch();
  }, []);

  return {
    data: calculateStoryPoints({
      ...result.data,
      issues: result.data.issues.map((i) => calculateStoryPoints(i)),
      storyPoints: [0, 0],
      players: [...result.data.players].reverse().reduce((all, player) => {
        if (all.find((x) => x.player === player.player) === undefined) {
          all.push(player);
        }
        return all;
      }, [] as typeof result.data.players),
    }),
    startNewVoting: (gameName: string) =>
      startNew.mutateAsync(gameName).then(() => profile?.refetch()),
    vote: voteFn,
    setIssues: { ...setIssues, mutateAsync: mutateSetIssues },
    setActiveIssue: { ...setActiveIssue, mutateAsync: mutateSetActiveIssue },
    finishGame,
    resumeGame,
    amIHost: profile?.data?.roomsCreated.find((r) => r === room) !== undefined,
  };
};

type GameResults = Issue & { issues: Issue[] };

type Issue = {
  finished: boolean;
  gameName: string;
  players: PlayerDto[];
  storyPoints: [average: number, rounded: number];
  tasks: string[];
  id: string;
};

function calculateStoryPoints<T extends { players: PlayerDto[] }>(
  issue: T
): T & { storyPoints: [average: number, rounded: number] } {
  const average =
    issue.players
      .map((x) => x.score)
      .filter((x): x is number => x !== null)
      .reduce<number>(
        (prevValue, currentValue) => prevValue + currentValue,
        0
      ) / issue.players.length;

  if (average <= 89) {
    const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const goal = Math.round(average);
    const closest = cardsValues.reduce(function (prev, curr) {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    return { ...issue, storyPoints: [average, closest] };
  } else {
    return { ...issue, storyPoints: [average, 100] };
  }
}
