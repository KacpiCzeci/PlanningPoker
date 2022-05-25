export type Issue = {
  finished: boolean;
  gameName: string;
  players: { player: string; score: number|undefined }[];
  tasks: string[];
  id: string;
  current: boolean;
};
