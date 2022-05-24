export type Issue = {
  finished: boolean;
  gameName: string;
  players: { player: string; score: number }[];
  tasks: string[];
};
