export type Issue = {
  finished: boolean;
  gameName: string;
  players: { player: string; score: number|null }[];
  tasks: string[];
  id: string;
  current: boolean;
};
