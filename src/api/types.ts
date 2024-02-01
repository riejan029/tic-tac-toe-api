type PlayerPosition = "p1" | "p2";
export interface PlayerObject {
  name: string;
  numberOfWins: number;
  numberOfLoss: number;
  numberOfDraws: number;
  position: PlayerPosition;
}

export interface CreatePlayersParams {
  players: PlayerObject[];
}
